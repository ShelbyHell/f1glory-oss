/* =====================================================================
   F1 Glory · GOAT Index, Super Licence Generator & Telemetry Chart
   Модуль аналитики величия, генератора лицензии FIA и графика карьеры
   ===================================================================== */

(function(){
  // --- FIA LEGENDS DATABASE ---
  const LEGENDS_DB = [
    { name: "Michael Schumacher", flag: "🇩🇪", titles: 7, wins: 91, podiums: 155, poles: 68, gp: 308, era: "1991–2012", goat: 2364 },
    { name: "Lewis Hamilton", flag: "🇬🇧", titles: 7, wins: 105, podiums: 201, poles: 104, gp: 356, era: "2007–н.в.", goat: 2866 },
    { name: "Ayrton Senna", flag: "🇧🇷", titles: 3, wins: 41, podiums: 80, poles: 65, gp: 161, era: "1984–1994", goat: 1225 },
    { name: "Alain Prost", flag: "🇫🇷", titles: 4, wins: 51, podiums: 106, poles: 33, gp: 199, era: "1980–1993", goat: 1433 },
    { name: "Max Verstappen", flag: "🇳🇱", titles: 4, wins: 63, podiums: 111, poles: 40, gp: 209, era: "2015–н.в.", goat: 1594 },
    { name: "Juan Manuel Fangio", flag: "🇦🇷", titles: 5, wins: 24, podiums: 35, poles: 29, gp: 51, era: "1950–1958", goat: 967 },
    { name: "Fernando Alonso", flag: "🇪🇸", titles: 2, wins: 32, podiums: 106, poles: 22, gp: 401, era: "2001–н.в.", goat: 1010 },
    { name: "Sebastian Vettel", flag: "🇩🇪", titles: 4, wins: 53, podiums: 122, poles: 57, gp: 299, era: "2007–2022", goat: 1589 },
    { name: "Niki Lauda", flag: "🇦🇹", titles: 3, wins: 25, podiums: 54, poles: 24, gp: 171, era: "1971–1985", goat: 838 },
    { name: "Jackie Stewart", flag: "🇬🇧", titles: 3, wins: 27, podiums: 43, poles: 17, gp: 99, era: "1965–1973", goat: 793 }
  ];

  function calcGoatScore(titles, wins, podiums, poles, gp) {
    const t = titles || 0;
    const w = wins || 0;
    const p = podiums || 0;
    const pp = poles || 0;
    const g = gp || 0;
    // Weighted formula: Title = 100 pts, Win = 10 pts, Podium = 4 pts, Pole = 3 pts, GP = 0.5 pt
    return Math.round((t * 100) + (w * 10) + (p * 4) + (pp * 3) + (g * 0.5));
  }

  function getGoatTier(score) {
    if(score >= 2000) return { title: "АБСОЛЮТНЫЙ GOAT // ИКОНА АВТОСПОРТА", color: "#ffd700", icon: "👑" };
    if(score >= 1200) return { title: "ТИЧЕСКИЙ ДОМИНАТОР // ВЕЛИКИЙ ЧЕМПИОН", color: "#f59e0b", icon: "🏆" };
    if(score >= 600) return { title: "ЧЕМПИОН МИРА ФОРМУЛЫ-1", color: "#10b981", icon: "🥇" };
    if(score >= 300) return { title: "ТРИУМФАТОР ГРАН-ПРИ", color: "#3b82f6", icon: "🥈" };
    if(score >= 100) return { title: "ПОСТОЯННЫЙ ПРИЗЁР И ВЕТЕРАН", color: "#8b5cf6", icon: "🥉" };
    return { title: "ПЕРСПЕКТИВНЫЙ БОЕЦ ПЕЛОТОНА", color: "#94a3b8", icon: "🏁" };
  }

  // =====================================================================
  // 1. TELEMETRY SVG CAREER CHART
  // =====================================================================
  let chartMode = "ovr"; // 'ovr' | 'pos' | 'both'

  function renderCareerChart() {
    const container = document.getElementById("careerChartWrap");
    if(!container) return;
    if(typeof S === "undefined" || !S || !S.seasons || S.seasons.length < 2) {
      container.style.display = "none";
      return;
    }

    container.style.display = "block";
    const seasons = S.seasons;
    const n = seasons.length;

    const width = 640;
    const height = 180;
    const padL = 40;
    const padR = 25;
    const padT = 25;
    const padB = 30;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    const getX = (i) => padL + (i / Math.max(1, n - 1)) * plotW;
    // OVR: range 40..95
    const getYOvr = (ovr) => padT + (1 - Math.max(0, Math.min(1, (ovr - 40) / 58))) * plotH;
    // Pos: range 1..22 (1 at top)
    const getYPos = (pos) => {
      const p = pos != null ? Math.min(22, Math.max(1, pos)) : 22;
      return padT + ((p - 1) / 21) * plotH;
    };

    let ovrPoints = [];
    let posPoints = [];
    let dots = [];

    seasons.forEach((s, idx) => {
      const x = getX(idx);
      const ovr = s.ovr || (s.cat === "TP" ? s.tpPrest : 50) || 50;
      const yOvr = getYOvr(ovr);
      ovrPoints.push(`${x},${yOvr}`);

      const pos = (s.cat === "F1" || s.cat === "TP") ? (s.pos || (s.constrPos || 15)) : (s.pos || 12);
      const yPos = getYPos(pos);
      posPoints.push(`${x},${yPos}`);

      const teamCol = (s.team && s.team.color) ? s.team.color : "#94a3b8";
      const tmName = (s.team && s.team.name) ? s.team.name : (s.tpTeam || "Free");
      const wins = s.wins || 0;
      const posTxt = s.pos ? `${s.pos}º` : "—";
      const tooltip = `${s.year || ''} (${s.age} лет): ${tmName} · OVR ${ovr} · Позиция: ${posTxt}${wins ? ` · Побед: ${wins} 🏆` : ''}`;

      dots.push(`
        <circle cx="${x}" cy="${chartMode === 'pos' ? yPos : yOvr}" r="5" fill="${teamCol}" stroke="#fff" stroke-width="2" class="chart-dot" data-tip="${tooltip}">
          <title>${tooltip}</title>
        </circle>
      `);
    });

    const ovrPath = `M ${ovrPoints.join(" L ")}`;
    const posPath = `M ${posPoints.join(" L ")}`;

    // Area fill under OVR line
    const areaPath = `M ${getX(0)},${height - padB} L ${ovrPoints.join(" L ")} L ${getX(n - 1)},${height - padB} Z`;

    const svg = `
      <div class="chart-controls">
        <span class="chart-title">📈 ТЕЛЕМЕТРИЯ ПРОГРЕССА КАРЬЕРЫ</span>
        <div class="chart-toggle-group">
          <button class="chart-btn ${chartMode==='ovr'?'on':''}" onclick="setF1ChartMode('ovr')">Рейтинг OVR</button>
          <button class="chart-btn ${chartMode==='pos'?'on':''}" onclick="setF1ChartMode('pos')">Места в ЧМ</button>
          <button class="chart-btn ${chartMode==='both'?'on':''}" onclick="setF1ChartMode('both')">Оба графика</button>
        </div>
      </div>
      <div class="svg-scroll-wrap">
        <svg viewBox="0 0 ${width} ${height}" class="f1-telemetry-svg">
          <defs>
            <linearGradient id="ovrGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--team-ink, #e10600)" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="var(--team-ink, #e10600)" stop-opacity="0.0"/>
            </linearGradient>
          </defs>

          <!-- Horizontal Grid Lines -->
          <line x1="${padL}" y1="${padT}" x2="${width - padR}" y2="${padT}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,3"/>
          <line x1="${padL}" y1="${padT + plotH * 0.5}" x2="${width - padR}" y2="${padT + plotH * 0.5}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,3"/>
          <line x1="${padL}" y1="${height - padB}" x2="${width - padR}" y2="${height - padB}" stroke="rgba(255,255,255,0.15)"/>

          <!-- Axis Labels -->
          ${chartMode !== 'pos' ? `
            <text x="${padL - 8}" y="${padT + 4}" fill="var(--muted)" font-size="10" text-anchor="end" font-family="var(--f-mono)">95</text>
            <text x="${padL - 8}" y="${padT + plotH * 0.5 + 4}" fill="var(--muted)" font-size="10" text-anchor="end" font-family="var(--f-mono)">68</text>
            <text x="${padL - 8}" y="${height - padB + 4}" fill="var(--muted)" font-size="10" text-anchor="end" font-family="var(--f-mono)">40</text>
          ` : `
            <text x="${padL - 8}" y="${padT + 4}" fill="#ffd700" font-size="10" text-anchor="end" font-family="var(--f-mono)">P1 🏆</text>
            <text x="${padL - 8}" y="${padT + plotH * 0.5 + 4}" fill="var(--muted)" font-size="10" text-anchor="end" font-family="var(--f-mono)">P10</text>
            <text x="${padL - 8}" y="${height - padB + 4}" fill="var(--muted)" font-size="10" text-anchor="end" font-family="var(--f-mono)">P20</text>
          `}

          <!-- Years at bottom -->
          <text x="${getX(0)}" y="${height - 10}" fill="var(--muted)" font-size="10" text-anchor="middle" font-family="var(--f-mono)">${seasons[0].year || seasons[0].age}</text>
          <text x="${getX(Math.floor(n/2))}" y="${height - 10}" fill="var(--muted)" font-size="10" text-anchor="middle" font-family="var(--f-mono)">${seasons[Math.floor(n/2)].year || seasons[Math.floor(n/2)].age}</text>
          <text x="${getX(n-1)}" y="${height - 10}" fill="var(--muted)" font-size="10" text-anchor="middle" font-family="var(--f-mono)">${seasons[n-1].year || seasons[n-1].age}</text>

          <!-- Area fill -->
          ${(chartMode === 'ovr' || chartMode === 'both') ? `<path d="${areaPath}" fill="url(#ovrGrad)" />` : ''}

          <!-- Lines -->
          ${(chartMode === 'ovr' || chartMode === 'both') ? `<path d="${ovrPath}" fill="none" stroke="var(--team-ink, #e10600)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />` : ''}
          ${(chartMode === 'pos' || chartMode === 'both') ? `<path d="${posPath}" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="${chartMode==='both'?'4,4':'none'}" stroke-linecap="round" stroke-linejoin="round" />` : ''}

          <!-- Season Dots -->
          ${dots.join("")}
        </svg>
      </div>
      <div class="chart-legend">
        ${(chartMode === 'ovr' || chartMode === 'both') ? `<span class="leg-item"><span class="leg-color" style="background:var(--team-ink,#e10600)"></span> Кривая OVR (мастерство)</span>` : ''}
        ${(chartMode === 'pos' || chartMode === 'both') ? `<span class="leg-item"><span class="leg-color" style="background:#38bdf8"></span> Финишная позиция в ЧМ</span>` : ''}
        <span class="leg-item tip">Точки окрашены в цвета команды сезона</span>
      </div>
    `;

    container.innerHTML = svg;
  }

  window.setF1ChartMode = function(m) {
    chartMode = m;
    renderCareerChart();
  };

  // =====================================================================
  // 2. GOAT COMPARISON MODAL
  // =====================================================================
  function createGoatModalDOM() {
    if(document.getElementById("goatModal")) return;
    const modal = document.createElement("div");
    modal.id = "goatModal";
    modal.className = "f1-modal-overlay";
    modal.innerHTML = `
      <div class="f1-modal-card goat-card">
        <div class="goat-head">
          <div class="goat-head-left">
            <span class="f1-mono-sub">FIA HALL OF FAME // HISTORICAL BENCHMARK</span>
            <h2>🐐 <span data-ru="Индекс Величия (GOAT) & Сравнение с Легендами" data-en="GOAT Index & Legends Comparison">Индекс Величия (GOAT)</span></h2>
          </div>
          <button class="rank-x" onclick="closeGoatModal()">✕</button>
        </div>

        <div class="goat-body" id="goatBody"></div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener("click", function(e){
      if(e.target === modal) closeGoatModal();
    });
  }

  function renderGoatModal() {
    createGoatModalDOM();
    const body = document.getElementById("goatBody");
    if(!body) return;

    if(typeof S === "undefined" || !S || !S.cat) {
      body.innerHTML = `<div class="goat-empty">Сначала начните карьеру, чтобы сравнить достижения с легендами!</div>`;
      return;
    }

    const myTitles = (S.titles && S.titles.f1) || 0;
    const myWins = S.wins || 0;
    const myPods = S.podiums || 0;
    const myPoles = S.poles || 0;
    const myGP = S.gp || 0;
    const myScore = calcGoatScore(myTitles, myWins, myPods, myPoles, myGP);
    const myTier = getGoatTier(myScore);
    const myName = (typeof sel !== "undefined" && sel.name) ? sel.name.toUpperCase() : "YOUR DRIVER";
    const myFlag = (typeof sel !== "undefined" && sel.flag) ? sel.flag : "🏁";

    // Combine player with legends and sort
    const all = [
      ...LEGENDS_DB,
      { isPlayer: true, name: myName, flag: myFlag, titles: myTitles, wins: myWins, podiums: myPods, poles: myPoles, gp: myGP, goat: myScore, era: "Ваша карьера" }
    ].sort((a,b) => b.goat - a.goat);

    const playerRank = all.findIndex(x => x.isPlayer) + 1;

    body.innerHTML = `
      <div class="goat-hero-banner" style="border-left: 4px solid ${myTier.color}">
        <div class="goat-hero-badge">${myTier.icon} ${myScore} PTS</div>
        <div class="goat-hero-info">
          <div class="goat-hero-tier" style="color:${myTier.color}">${myTier.title}</div>
          <div class="goat-hero-desc">Вы занимаете <b>#${playerRank} место</b> среди всех времён и легендарных пилотов F1!</div>
        </div>
      </div>

      <div class="goat-table-wrap">
        <table class="goat-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Пилот</th>
              <th title="Титулы Чемпиона Мира">🏆 Титулы</th>
              <th title="Победы">🥇 Победы</th>
              <th title="Подиумы">🥉 Подиумы</th>
              <th title="Поулы">⏱️ Поулы</th>
              <th title="Гран-при">🏁 GP</th>
              <th title="Индекс величия (GOAT Score)">⭐ Индекс</th>
            </tr>
          </thead>
          <tbody>
            ${all.map((p, idx) => `
              <tr class="${p.isPlayer ? 'me-row' : ''}">
                <td class="gt-rank">${idx + 1}</td>
                <td class="gt-name">
                  <span class="gt-fl">${p.flag}</span>
                  <b>${p.name}</b>
                  ${p.isPlayer ? `<span class="me-tag">ВЫ</span>` : `<span class="gt-era">${p.era}</span>`}
                </td>
                <td class="gt-stat ${p.titles>0?'gold':''}">${p.titles}</td>
                <td class="gt-stat">${p.wins}</td>
                <td class="gt-stat">${p.podiums}</td>
                <td class="gt-stat">${p.poles}</td>
                <td class="gt-stat">${p.gp}</td>
                <td class="gt-score"><b>${p.goat}</b></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div class="goat-formula-hint">
        ℹ️ <b>Формула GOAT Index FIA:</b> Титул Чемпиона = 100 pts · Победа в Гран-при = 10 pts · Подиум = 4 pts · Поул-позиция = 3 pts · Опыт = 0.5 pt за GP.
      </div>
    `;
  }

  window.openGoatModal = function() {
    renderGoatModal();
    const modal = document.getElementById("goatModal");
    if(modal) modal.style.display = "flex";
  };

  window.closeGoatModal = function() {
    const modal = document.getElementById("goatModal");
    if(modal) modal.style.display = "none";
  };

  // =====================================================================
  // 3. FIA SUPER LICENCE CANVAS GENERATOR
  // =====================================================================
  function createSuperLicenceModalDOM() {
    if(document.getElementById("licenceModal")) return;
    const modal = document.createElement("div");
    modal.id = "licenceModal";
    modal.className = "f1-modal-overlay";
    modal.innerHTML = `
      <div class="f1-modal-card licence-card">
        <div class="licence-head">
          <div>
            <span class="f1-mono-sub">FIA DIGITAL CREDENTIALS // COMPETITOR PASS</span>
            <h2>🪪 <span data-ru="Суперлицензия FIA" data-en="FIA Super Licence">Суперлицензия FIA</span></h2>
          </div>
          <button class="rank-x" onclick="closeSuperLicenceModal()">✕</button>
        </div>

        <div class="licence-canvas-container">
          <canvas id="licenceCanvas" width="850" height="520"></canvas>
        </div>

        <div class="licence-actions">
          <button class="btn" onclick="downloadSuperLicencePNG()">📥 Скачать карточку в PNG</button>
          <button class="btn ghost" onclick="closeSuperLicenceModal()">Закрыть</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener("click", function(e){
      if(e.target === modal) closeSuperLicenceModal();
    });
  }

  function drawSuperLicence() {
    createSuperLicenceModalDOM();
    const canvas = document.getElementById("licenceCanvas");
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    if(typeof S === "undefined" || !S || !S.cat) {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      ctx.font = "20px sans-serif";
      ctx.fillText("Начните карьеру для создания суперлицензии", 50, 50);
      return;
    }

    const isTP = S.cat === "TP" || (typeof TP_MODE !== "undefined" && TP_MODE);
    const drvName = (typeof sel !== "undefined" && sel.name) ? sel.name.toUpperCase() : "DRIVER";
    const drvNum = (typeof sel !== "undefined" && sel.num) ? `#${sel.num}` : "#10";
    const flag = (typeof sel !== "undefined" && sel.flag) ? sel.flag : "🏁";
    const tm = S.team ? S.team.name : (S.tpTeam || "Free Agent");
    const tmColor = (S.team && S.team.color) ? S.team.color : "#e10600";
    const peakOvr = S.peakOvr || S.ovr || 50;
    const titles = (S.titles && S.titles.f1) || 0;
    const wins = S.wins || 0;
    const podiums = S.podiums || 0;
    const poles = S.poles || 0;
    const gp = S.gp || 0;
    const curYear = (typeof yearNow === "function") ? yearNow() : (S.baseYear + (S.age - (S.startAge || 16)));

    // 1. Dark Carbon/High-Tech Background
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, "#0c0d14");
    bgGrad.addColorStop(0.5, "#151824");
    bgGrad.addColorStop(1, "#0a0b10");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Carbon pattern overlay
    ctx.fillStyle = "rgba(255, 255, 255, 0.015)";
    for(let y = 0; y < H; y += 4) {
      ctx.fillRect(0, y, W, 1);
    }

    // 2. Team Accent Neon Light Streak
    const beamGrad = ctx.createLinearGradient(0, 0, W, 0);
    beamGrad.addColorStop(0, "transparent");
    beamGrad.addColorStop(0.2, tmColor);
    beamGrad.addColorStop(0.8, tmColor);
    beamGrad.addColorStop(1, "transparent");
    ctx.fillStyle = beamGrad;
    ctx.fillRect(0, 0, W, 5);

    // Decorative Circuit Neon Lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(30, 80);
    ctx.lineTo(W - 30, 80);
    ctx.moveTo(30, H - 70);
    ctx.lineTo(W - 30, H - 70);
    ctx.stroke();

    // 3. Header
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px 'Chakra Petch', monospace, sans-serif";
    ctx.letterSpacing = "2px";
    ctx.fillText("FÉDÉRATION INTERNATIONALE DE L'AUTOMOBILE", 40, 42);

    ctx.fillStyle = "#e10600";
    ctx.font = "900 13px 'Chakra Petch', monospace, sans-serif";
    ctx.fillText("FIA OFFICIAL DOCUMENT", W - 220, 42);

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "10px monospace";
    ctx.fillText("GRADE A // FORMULA ONE WORLD CHAMPIONSHIP", 40, 60);

    // 4. Pilot Avatar & Number Plate Box (Left)
    const boxX = 40;
    const boxY = 105;
    const boxW = 200;
    const boxH = 320;

    // Card Photo Frame
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 16);
    ctx.fill();
    ctx.stroke();

    // Driver Number Badge
    ctx.fillStyle = tmColor;
    ctx.beginPath();
    ctx.roundRect(boxX + 20, boxY + 20, boxW - 40, 80, 12);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 48px 'Anybody', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(isTP ? "TP" : drvNum, boxX + boxW/2, boxY + 78);

    // Flag & Peak OVR
    ctx.font = "34px sans-serif";
    ctx.fillText(flag, boxX + boxW/2, boxY + 160);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px 'Chakra Petch', sans-serif";
    ctx.fillText(isTP ? "ROLE: TEAM BOSS" : "PEAK DRIVER RATING", boxX + boxW/2, boxY + 205);

    ctx.fillStyle = "#10b981";
    ctx.font = "900 38px 'Anybody', monospace";
    ctx.fillText(`${peakOvr}`, boxX + boxW/2, boxY + 250);

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "10px monospace";
    ctx.fillText("MAX OVR ACHIEVED", boxX + boxW/2, boxY + 275);

    // 5. Driver Identity & Main Data (Right)
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 36px 'Anybody', 'Chakra Petch', sans-serif";
    ctx.fillText(drvName, 275, 140);

    ctx.fillStyle = tmColor;
    ctx.font = "bold 16px 'Chakra Petch', sans-serif";
    ctx.fillText(isTP ? `TEAM PRINCIPAL // ${tm}` : `FORMULA 1 DRIVER // ${tm}`, 275, 170);

    // Stats Grid
    const statX = 275;
    const statY = 205;
    const colW = 130;

    const stats = [
      { k: "WORLD TITLES", v: `${titles}`, gold: titles > 0 },
      { k: "VICTORIES", v: `${wins}`, gold: wins > 0 },
      { k: "PODIUMS", v: `${podiums}`, gold: false },
      { k: "POLES", v: `${poles}`, gold: false },
      { k: "GRAND PRIX", v: `${gp}`, gold: false },
      { k: "SEASONS", v: `${S.age - S.startAge}`, gold: false }
    ];

    stats.forEach((st, idx) => {
      const rx = statX + (idx % 3) * 175;
      const ry = statY + Math.floor(idx / 3) * 75;

      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.beginPath();
      ctx.roundRect(rx, ry, 160, 62, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "bold 9.5px 'Chakra Petch', monospace";
      ctx.fillText(st.k, rx + 14, ry + 22);

      ctx.fillStyle = st.gold ? "#ffd700" : "#ffffff";
      ctx.font = "900 24px 'Anybody', monospace";
      ctx.fillText(st.v, rx + 14, ry + 50);
    });

    // 6. Holographic FIA Seal & Serial (Bottom)
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.font = "10px monospace";
    const serial = `LIC-FIA-F1-${drvName.slice(0,3)}-${curYear}-${Math.abs(peakOvr * 137).toString(16).toUpperCase()}`;
    ctx.fillText(`DOCUMENT ID: ${serial}`, 40, H - 35);
    ctx.fillText(`VALIDATED BY FIA COMMISSAIRES // SEASON ${curYear}`, 40, H - 20);

    // Gold Seal Circle (Bottom Right)
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(W - 85, H - 42, 28, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#ffd700";
    ctx.font = "900 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("FIA", W - 85, H - 45);
    ctx.font = "7px monospace";
    ctx.fillText("VERIFIED", W - 85, H - 33);
  }

  window.openSuperLicenceModal = function() {
    createSuperLicenceModalDOM();
    const modal = document.getElementById("licenceModal");
    if(modal) {
      modal.style.display = "flex";
      setTimeout(drawSuperLicence, 50);
    }
  };

  window.closeSuperLicenceModal = function() {
    const modal = document.getElementById("licenceModal");
    if(modal) modal.style.display = "none";
  };

  window.downloadSuperLicencePNG = function() {
    const canvas = document.getElementById("licenceCanvas");
    if(!canvas) return;
    const drv = (typeof sel !== "undefined" && sel.name) ? sel.name.toLowerCase().replace(/[^a-z0-9]/g,"_") : "driver";
    const link = document.createElement("a");
    link.download = `fia_superlicence_${drv}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    if(window.showF1Toast) window.showF1Toast("Суперлицензия FIA сохранена в PNG!", "success");
  };

  // --- UI HOOKS & BUTTONS ---
  function initHooks() {
    createGoatModalDOM();
    createSuperLicenceModalDOM();

    // Add buttons into driverCard
    const driverCard = document.getElementById("driverCard");
    if(driverCard && !document.getElementById("btnLicenceDriver")) {
      let actWrap = document.getElementById("driverCardExtraBtns");
      if(!actWrap) {
        actWrap = document.createElement("div");
        actWrap.id = "driverCardExtraBtns";
        actWrap.className = "driver-card-extra-btns";
        driverCard.appendChild(actWrap);
      }
      actWrap.innerHTML = `
        <button class="btn ghost btn-extra-tool" onclick="openSuperLicenceModal()" title="Сгенерировать официальную суперлицензию FIA">
          🪪 Суперлицензия FIA
        </button>
        <button class="btn ghost btn-extra-tool" onclick="openGoatModal()" title="Сравнение достижений с легендами F1">
          🐐 Индекс Величия (GOAT)
        </button>
      `;
    }

    // Add Chart container into timeline panel
    const tlPanel = document.getElementById("tlPanel");
    if(tlPanel && !document.getElementById("careerChartWrap")) {
      const chartWrap = document.createElement("div");
      chartWrap.id = "careerChartWrap";
      chartWrap.className = "career-chart-wrap";
      tlPanel.insertBefore(chartWrap, tlPanel.firstChild);
    }

    // Add GOAT link in intro links
    const introLinks = document.querySelector(".intro-links");
    if(introLinks && !document.getElementById("introGoatLink")) {
      const sep = document.createElement("span");
      sep.className = "il-sep";
      sep.textContent = "·";
      const a = document.createElement("a");
      a.id = "introGoatLink";
      a.onclick = openGoatModal;
      a.textContent = "🐐 Зал Славы (GOAT)";
      introLinks.appendChild(sep);
      introLinks.appendChild(a);
    }
  }

  // Hook into timeline render
  const originalRenderTimeline = window.renderTimeline;
  window.renderTimeline = function() {
    if(typeof originalRenderTimeline === "function") {
      originalRenderTimeline.apply(this, arguments);
    }
    try { renderCareerChart(); } catch(e){}
  };

  if(document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHooks);
  } else {
    initHooks();
  }
})();
