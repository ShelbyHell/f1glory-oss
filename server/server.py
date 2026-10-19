#!/usr/bin/env python3
"""
F1 Glory - Standalone Local Server & API
Run with: python3 server/server.py [PORT]
"""

import sys, os, json, time, urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
SERVER_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.realpath(os.path.join(SERVER_DIR, '..', 'public'))
DATA_DIR = os.path.join(SERVER_DIR, 'data')
DB_FILE = os.path.join(DATA_DIR, 'leaderboard.json')
SEED_FILE = os.path.join(DATA_DIR, 'seed_leaderboard.json')

os.makedirs(DATA_DIR, exist_ok=True)

leaderboard = {}
if os.path.exists(DB_FILE):
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            leaderboard = json.load(f)
    except Exception as e:
        print(f"Error loading {DB_FILE}: {e}")
elif os.path.exists(SEED_FILE):
    try:
        with open(SEED_FILE, 'r', encoding='utf-8') as f:
            leaderboard = json.load(f)
    except Exception as e:
        print(f"Error loading {SEED_FILE}: {e}")

def save_db():
    try:
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(leaderboard, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Failed to save DB: {e}")

MIME_TYPES = {
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
}

def gloria_driver(b):
    b = b or {}
    return ((b.get('f1', 0) * 120) + (b.get('constr', 0) * 30) +
            (b.get('wins', 0) * 3) + b.get('podiums', 0) +
            b.get('poles', 0) + (b.get('subcamp', 0) * 15))

def gloria_tp(b):
    b = b or {}
    return (b.get('constr', 0) * 150 + b.get('f1', 0) * 90 +
            b.get('wins', 0) * 2 + round(b.get('podiums', 0) * 0.5) +
            max(0, round(b.get('over', 0) * 8)) + b.get('seasons', 0) * 3)

def recompute_ranks(scope):
    if scope not in leaderboard:
        leaderboard[scope] = []
    leaderboard[scope].sort(key=lambda x: x.get('gloria', 0), reverse=True)
    for idx, row in enumerate(leaderboard[scope]):
        row['rank'] = idx + 1

class Handler(BaseHTTPRequestHandler):
    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        pathname = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # Vercel Insights stub
        if pathname == '/_vercel/insights/script.js':
            self.send_response(200)
            self.send_header('Content-Type', 'application/javascript')
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(b'// Vercel analytics stub\n')
            return

        # GET /api/leaderboard
        if pathname == '/api/leaderboard':
            scope = query.get('scope', ['g'])[0]
            limit = int(query.get('limit', ['100'])[0])
            recompute_ranks(scope)
            rows = leaderboard.get(scope, [])[:limit]
            res = {
                "scope": scope,
                "key": f"lb:{scope}",
                "count": len(rows),
                "rows": rows,
                "me": None
            }
            body = json.dumps(res, ensure_ascii=False).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(body)
            return

        # GET /api/me
        if pathname == '/api/me':
            scope = query.get('scope', ['g'])[0]
            pid = query.get('id', [None])[0]
            recompute_ranks(scope)
            found = next((r for r in leaderboard.get(scope, []) if r.get('id') == pid), None)
            res = {"me": {"rank": found['rank'], "gloria": found['gloria']} if found else None}
            body = json.dumps(res, ensure_ascii=False).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(body)
            return

        # Static files from BASE_DIR (public/)
        rel_path = urllib.parse.unquote(pathname.lstrip('/'))
        if not rel_path:
            rel_path = 'index.html'

        full_path = os.path.realpath(os.path.join(BASE_DIR, rel_path))
        if not full_path.startswith(BASE_DIR) or not os.path.isfile(full_path):
            self.send_response(404)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'Not Found')
            return

        ext = os.path.splitext(full_path)[1].lower()
        content_type = MIME_TYPES.get(ext, 'application/octet-stream')

        self.send_response(200)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Length', str(os.path.getsize(full_path)))
        self.send_cors_headers()
        self.end_headers()

        with open(full_path, 'rb') as f:
            while chunk := f.read(65536):
                self.wfile.write(chunk)

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        pathname = parsed.path

        if pathname == '/api/submit':
            length = int(self.headers.get('Content-Length', 0))
            raw = self.rfile.read(length)
            try:
                body = json.loads(raw.decode('utf-8'))
                era = body.get('era')
                ch = body.get('ch')
                is_tp = bool(era and str(era).startswith('tp'))
                score = gloria_tp(body.get('b')) if is_tp else gloria_driver(body.get('b'))

                new_entry = {
                    "id": body.get('id'),
                    "name": (body.get('name') or 'ANON')[:24].upper(),
                    "flag": body.get('flag', '🏁'),
                    "country": body.get('country', ''),
                    "gloria": score,
                    "era": era,
                    "ch": ch,
                    "updatedAt": int(time.time() * 1000)
                }

                target_scopes = []
                if is_tp:
                    era_scope = 'e:tp2025' if era == 'tp2025' else ('e:tp2024' if era == 'tp2024' else 'e:tp')
                    if ch:
                        target_scopes.append(f"c:{ch}")
                    else:
                        target_scopes.append(era_scope)
                else:
                    target_scopes.append('g')
                    if era:
                        target_scopes.append(f"e:{era}")
                    if ch:
                        target_scopes.append(f"c:{ch}")

                for sc in target_scopes:
                    if sc not in leaderboard:
                        leaderboard[sc] = []
                    existing = next((r for r in leaderboard[sc] if r.get('id') == body.get('id')), None)
                    if existing:
                        if existing.get('gloria', 0) < score:
                            existing.update(new_entry)
                    else:
                        leaderboard[sc].append(new_entry)
                    recompute_ranks(sc)

                save_db()

                res = {"ok": True, "score": score}
                data = json.dumps(res).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(data)
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return

        if pathname == '/api/remove':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(b'{"ok": true}')
            return

        self.send_response(404)
        self.end_headers()

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', PORT), Handler)
    print(f"\n========================================")
    print(f"🏁 F1 Glory Server (Python) is running!")
    print(f"👉 http://localhost:{PORT}")
    print(f"📁 Serving files from: {BASE_DIR}")
    print(f"========================================\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
