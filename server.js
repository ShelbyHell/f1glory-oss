const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'leaderboard.json');
const SEED_FILE = path.join(DATA_DIR, 'seed_leaderboard.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load or initialize leaderboard database
let leaderboard = {};
if (fs.existsSync(DB_FILE)) {
  try {
    leaderboard = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    console.error('Error reading database, starting fresh:', e);
  }
} else if (fs.existsSync(SEED_FILE)) {
  try {
    leaderboard = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
  } catch (e) {
    console.error('Error reading seed database:', e);
  }
}

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(leaderboard, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save DB:', e);
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function gloriaDriver(b) {
  b = b || {};
  return (b.f1 || 0) * 120 + (b.constr || 0) * 30 + (b.wins || 0) * 3 +
         (b.podiums || 0) + (b.poles || 0) + (b.subcamp || 0) * 15;
}

function gloriaTP(b) {
  b = b || {};
  return (b.constr || 0) * 150 + (b.f1 || 0) * 90 + (b.wins || 0) * 2 +
         Math.round((b.podiums || 0) * 0.5) + Math.max(0, Math.round((b.over || 0) * 8)) +
         (b.seasons || 0) * 3;
}

function recomputeRanks(scope) {
  if (!leaderboard[scope]) leaderboard[scope] = [];
  leaderboard[scope].sort((a, b) => (b.gloria || 0) - (a.gloria || 0));
  leaderboard[scope].forEach((row, idx) => {
    row.rank = idx + 1;
  });
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Vercel Analytics stub
  if (pathname === '/_vercel/insights/script.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end('// Vercel analytics stub');
    return;
  }

  // API: GET /api/leaderboard
  if (req.method === 'GET' && pathname === '/api/leaderboard') {
    const scope = parsed.query.scope || 'g';
    const limit = parseInt(parsed.query.limit, 10) || 100;

    recomputeRanks(scope);
    const rows = (leaderboard[scope] || []).slice(0, limit);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      scope,
      key: `lb:${scope}`,
      count: rows.length,
      rows,
      me: null
    }));
    return;
  }

  // API: GET /api/me
  if (req.method === 'GET' && pathname === '/api/me') {
    const scope = parsed.query.scope || 'g';
    const id = parsed.query.id;
    recomputeRanks(scope);

    const found = (leaderboard[scope] || []).find(r => r.id === id);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      me: found ? { rank: found.rank, gloria: found.gloria } : null
    }));
    return;
  }

  // API: POST /api/submit
  if (req.method === 'POST' && pathname === '/api/submit') {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      try {
        const body = JSON.parse(raw);
        const isTP = (body.era && String(body.era).startsWith('tp'));
        const score = isTP ? gloriaTP(body.b) : gloriaDriver(body.b);

        const newEntry = {
          id: body.id,
          name: (body.name || 'ANON').slice(0, 24).toUpperCase(),
          flag: body.flag || '🏁',
          country: body.country || '',
          gloria: score,
          era: body.era,
          ch: body.ch,
          updatedAt: Date.now()
        };

        const targetScopes = [];
        if (isTP) {
          const eraScope = body.era === 'tp2025' ? 'e:tp2025' : (body.era === 'tp2024' ? 'e:tp2024' : 'e:tp');
          if (body.ch) targetScopes.push(`c:${body.ch}`);
          else targetScopes.push(eraScope);
        } else {
          targetScopes.push('g');
          if (body.era) targetScopes.push(`e:${body.era}`);
          if (body.ch) targetScopes.push(`c:${body.ch}`);
        }

        for (const sc of targetScopes) {
          if (!leaderboard[sc]) leaderboard[sc] = [];
          const existingIdx = leaderboard[sc].findIndex(r => r.id === body.id);
          if (existingIdx >= 0) {
            if ((leaderboard[sc][existingIdx].gloria || 0) < score) {
              leaderboard[sc][existingIdx] = newEntry;
            }
          } else {
            leaderboard[sc].push(newEntry);
          }
          recomputeRanks(sc);
        }

        saveDB();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, score }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'invalid payload' }));
      }
    });
    return;
  }

  // API: POST /api/remove
  if (req.method === 'POST' && pathname === '/api/remove') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // Static file serving
  let reqPath = decodeURIComponent(pathname);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const safePath = path.normalize(path.join(__dirname, reqPath));
  if (!safePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
    });

    const stream = fs.createReadStream(safePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`🏁 F1 Glory Server is running!`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`========================================\n`);
});
