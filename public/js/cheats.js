/* =====================================================================
   F1 Glory · Cheats Module / Чит-меню
   ===================================================================== */

(function(){
  // Add CSS styles for cheat modal and buttons
  const style = document.createElement("style");
  style.textContent = `
    #cheatModal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(10, 12, 20, 0.65);
      backdrop-filter: blur(8px);
      z-index: 100;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    #cheatToggle {
      background: rgba(255, 215, 0, 0.2);
      border: 1px solid rgba(255, 215, 0, 0.5);
      color: #ffd700;
      border-radius: 999px;
      width: 34px;
      height: 34px;
      flex: 0 0 34px;
      font-size: 16px;
      line-height: 1;
      box-shadow: 0 2px 8px rgba(255, 215, 0, 0.25);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.15s, background 0.15s;
    }
    #cheatToggle:hover {
      background: rgba(255, 215, 0, 0.35);
      transform: scale(1.08);
    }
    #topBtns:not(.open) #cheatToggle {
      display: none;
    }
    #topBtns.open #cheatToggle {
      box-shadow: 0 0 0 1px rgba(255, 215, 0, 0.5), 0 8px 22px rgba(255, 215, 0, 0.25);
    }
    body.deck-movil #topBtns.open #cheatToggle {
      position: absolute;
      right: 2px;
      z-index: 35;
      top: 182px;
    }
    .cheat-card {
      background: var(--panel, #1e1e24);
      border: 1px solid var(--line, #333);
      border-radius: 20px;
      max-width: 560px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
      animation: fadeUp 0.3s ease-out;
      color: var(--text, #eee);
    }
    .cheat-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: linear-gradient(135deg, #181926, #2d1808);
      border-bottom: 1px solid rgba(255, 215, 0, 0.2);
      color: #fff;
    }
    .cheat-head h2 {
      font-size: 18px;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .cheat-tabs {
      display: flex;
      gap: 6px;
      padding: 10px 16px;
      background: var(--panel2, #181920);
      border-bottom: 1px solid var(--line, #333);
      overflow-x: auto;
    }
    .cheat-tabs button {
      flex: 1;
      padding: 8px 10px;
      border: 1px solid var(--line, #333);
      background: var(--panel, #222);
      color: var(--muted, #aaa);
      border-radius: 10px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s;
    }
    .cheat-tabs button.active {
      background: #e10600;
      color: #fff;
      border-color: transparent;
      box-shadow: 0 2px 8px rgba(225, 6, 0, 0.4);
    }
    .cheat-body {
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .cheat-section {
      background: var(--panel2, #14151c);
      border: 1px solid var(--line, #2c2d38);
      border-radius: 12px;
      padding: 12px 14px;
    }
    .cheat-sec-title {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: var(--muted, #888);
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }
    .cheat-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }
    .cheat-btn {
      background: var(--panel, #242532);
      border: 1px solid var(--line, #3a3b4c);
      color: var(--text, #ddd);
      padding: 7px 12px;
      border-radius: 8px;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: background 0.15s, transform 0.1s, border-color 0.15s;
    }
    .cheat-btn:hover {
      background: var(--line, #3a3b4c);
      color: #fff;
      transform: translateY(-1px);
    }
    .cheat-btn.gold {
      background: rgba(255, 215, 0, 0.15);
      border-color: rgba(255, 215, 0, 0.4);
      color: #ffd700;
    }
    .cheat-btn.gold:hover {
      background: rgba(255, 215, 0, 0.3);
      color: #fff;
    }
    .cheat-btn.danger {
      background: rgba(225, 6, 0, 0.15);
      border-color: rgba(225, 6, 0, 0.4);
      color: #ff6b6b;
    }
    .cheat-btn.danger:hover {
      background: rgba(225, 6, 0, 0.3);
      color: #fff;
    }
    .cheat-btn.active {
      background: #16a34a;
      border-color: #22c55e;
      color: #fff;
    }
    .cheat-status {
      font-size: 12px;
      color: var(--gold, #c9a227);
      margin-bottom: 8px;
      font-weight: 600;
    }
    .cheat-team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 6px;
    }
    .cheat-msg {
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 6px;
      display: none;
    }
    .cheat-msg.show {
      display: block;
      animation: fadeUp 0.2s;
    }
    .cheat-msg.ok {
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }
  `;
  document.head.appendChild(style);

  // Helper notification
  function notify(msg) {
    const el = document.getElementById("cheatMsg");
    if(!el) return;
    el.textContent = msg;
    el.className = "cheat-msg show ok";
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.className = "cheat-msg"; }, 2500);
  }

  // Active tab state
  let currentTab = "driver";

  // Build Cheat Modal HTML
  function ensureCheatModal() {
    if (document.getElementById("cheatModal")) return;

    const modal = document.createElement("div");
    modal.id = "cheatModal";
    modal.innerHTML = `
      <div class="cheat-card">
        <div class="cheat-head">
          <h2>⚡ <span>Чит-меню</span></h2>
          <button class="rank-x" onclick="closeCheatMenu()">✕</button>
        </div>
        <div class="cheat-tabs" id="cheatTabs">
          <button class="active" onclick="switchCheatTab('driver')">🏎️ Пилот</button>
          <button onclick="switchCheatTab('car')">🚀 Болид & Команда</button>
          <button onclick="switchCheatTab('tp')">🧑‍💼 Team Principal</button>
          <button onclick="switchCheatTab('quick')">⚡ Быстрые действия</button>
        </div>
        <div class="cheat-body" id="cheatContent"></div>
        <div id="cheatMsg" class="cheat-msg"></div>
      </div>
    `;
    modal.onclick = (e) => {
      if (e.target === modal) closeCheatMenu();
    };
    document.body.appendChild(modal);

    // Also add button to topBtns if not present
    const topBtns = document.getElementById("topBtns");
    if (topBtns && !document.getElementById("cheatToggle")) {
      const btn = document.createElement("button");
      btn.id = "cheatToggle";
      btn.title = "Чит-меню (F2)";
      btn.innerHTML = "⚡";
      btn.onclick = toggleCheatMenu;
      // Insert right next to langToggle
      topBtns.insertBefore(btn, topBtns.firstChild);
    }
  }

  // Global toggle
  window.toggleCheatMenu = function() {
    const modal = document.getElementById("cheatModal");
    if (!modal) {
      ensureCheatModal();
      document.getElementById("cheatModal").style.display = "flex";
      renderCheatContent();
    } else {
      if (modal.style.display === "flex") {
        closeCheatMenu();
      } else {
        modal.style.display = "flex";
        renderCheatContent();
      }
    }
  };

  window.closeCheatMenu = function() {
    const modal = document.getElementById("cheatModal");
    if (modal) modal.style.display = "none";
  };

  window.switchCheatTab = function(tab) {
    currentTab = tab;
    const tabs = document.querySelectorAll("#cheatTabs button");
    tabs.forEach(b => b.classList.remove("active"));
    if (tab === "driver") tabs[0].classList.add("active");
    if (tab === "car") tabs[1].classList.add("active");
    if (tab === "tp") tabs[2].classList.add("active");
    if (tab === "quick") tabs[3].classList.add("active");
    renderCheatContent();
  };

  function hasGame() {
    return typeof S !== "undefined" && S !== null;
  }

  // Render content according to active tab
  function renderCheatContent() {
    const box = document.getElementById("cheatContent");
    if (!box) return;

    if (!hasGame()) {
      box.innerHTML = `
        <div class="cheat-section">
          <div class="cheat-status">⚠️ Карьера ещё не начата. Начните карьеру, чтобы управлять характеристиками пилота и болида!</div>
          <div class="cheat-sec-title">Общие разблокировки</div>
          <div class="cheat-row">
            <button class="cheat-btn gold" onclick="cheatUnlockAllDecades()">🔓 Разблокировать все эпохи (1950–2020)</button>
            <button class="cheat-btn gold" onclick="cheatUnlockTPCard()">🧑‍💼 Разблокировать режим Team Principal</button>
            <button class="cheat-btn gold" onclick="cheatUnlockChallenges()">📅 Разблокировать все испытания</button>
            <button class="cheat-btn" onclick="cheatTogglePreview()">🧪 Режим разработчика (Preview: ${typeof PREVIEW !== "undefined" && PREVIEW ? "ВКЛ" : "ВЫКЛ"})</button>
          </div>
        </div>
      `;
      return;
    }

    if (currentTab === "driver") {
      const curOvr = S.ovr || 50;
      const curAge = S.age || 20;
      const curVal = S.val || 10;
      box.innerHTML = `
        <div class="cheat-status">Пилот: <b>${(sel.name || "Гонщик").toUpperCase()}</b> · Сезон: <b>${yearNow()}</b> · Возраст: <b>${curAge}</b> · OVR: <b>${curOvr}</b> · Слава: <b>${Math.round(curVal)}</b></div>
        
        <div class="cheat-section">
          <div class="cheat-sec-title">Общий рейтинг (OVR) <span>Текущий: ${curOvr}</span></div>
          <div class="cheat-row">
            <button class="cheat-btn" onclick="cheatAddOvr(-5)">-5 OVR</button>
            <button class="cheat-btn" onclick="cheatAddOvr(1)">+1 OVR</button>
            <button class="cheat-btn" onclick="cheatAddOvr(5)">+5 OVR</button>
            <button class="cheat-btn gold" onclick="cheatSetOvr(90)">90 (Суперзвезда)</button>
            <button class="cheat-btn gold" onclick="cheatSetOvr(99)">99 (МАКСИМУМ 🚀)</button>
          </div>
        </div>

        <div class="cheat-section">
          <div class="cheat-sec-title">Возраст пилота <span>Текущий: ${curAge} лет</span></div>
          <div class="cheat-row">
            <button class="cheat-btn" onclick="cheatAddAge(-5)">-5 лет моложе</button>
            <button class="cheat-btn" onclick="cheatAddAge(-1)">-1 год</button>
            <button class="cheat-btn gold" onclick="cheatSetAge(18)">Сделать 18 лет</button>
            <button class="cheat-btn" onclick="cheatAddAge(1)">+1 год</button>
            <button class="cheat-btn gold" onclick="cheatSetAge(65)">65 лет (Предел)</button>
          </div>
        </div>

        <div class="cheat-section">
          <div class="cheat-sec-title">Слава и Статус <span>Текущая слава: ${Math.round(curVal)}</span></div>
          <div class="cheat-row">
            <button class="cheat-btn" onclick="cheatAddFame(200)">+200 Славы</button>
            <button class="cheat-btn" onclick="cheatAddFame(800)">+800 Славы</button>
            <button class="cheat-btn gold" onclick="cheatSetMaxFame()">🌟 Стать БЕССМЕРТНЫМ (Max)</button>
          </div>
        </div>

        <div class="cheat-section">
          <div class="cheat-sec-title">Карьерная статистика</div>
          <div class="cheat-row">
            <button class="cheat-btn" onclick="cheatAddStat('wins', 1)">+1 Победа</button>
            <button class="cheat-btn" onclick="cheatAddStat('wins', 5)">+5 Побед</button>
            <button class="cheat-btn" onclick="cheatAddStat('podiums', 5)">+5 Подиумов</button>
            <button class="cheat-btn" onclick="cheatAddStat('poles', 5)">+5 Поулов</button>
            <button class="cheat-btn gold" onclick="cheatAddStat('titles', 1)">🏆 +1 Титул Чемпиона Ф1</button>
          </div>
        </div>

        <div class="cheat-section">
          <div class="cheat-sec-title">Стиль пилотажа & Здоровье</div>
          <div class="cheat-row">
            <button class="cheat-btn ${sel.style==='agresivo'?'active':''}" onclick="cheatSetStyle('agresivo')">🔥 Агрессивный</button>
            <button class="cheat-btn ${sel.style==='tecnico'?'active':''}" onclick="cheatSetStyle('tecnico')">🧠 Техничный</button>
            <button class="cheat-btn ${sel.style==='consistente'?'active':''}" onclick="cheatSetStyle('consistente')">📈 Стабильный</button>
            <button class="cheat-btn gold" onclick="cheatClearBlacklists()">🤝 Снять баны всех команд (Reset Blacklist)</button>
            <button class="cheat-btn" onclick="cheatHeal()">🩹 Вылечить травмы и баны</button>
          </div>
        </div>
      `;
    } else if (currentTab === "car") {
      const myTeamName = (S.team && S.team.name) || S.tpTeam || "Без команды";
      const myPerf = (S.f1perf && S.f1perf[myTeamName]) ? Math.round(S.f1perf[myTeamName]) : (S.team ? S.team.perf : 75);
      const godActive = !!S._godMode;

      box.innerHTML = `
        <div class="cheat-status">Текущая команда: <b>${myTeamName}</b> · Перформанс: <b>${myPerf}/100</b></div>

        <div class="cheat-section">
          <div class="cheat-sec-title">⚡ Режим Бога (God Mode)</div>
          <div class="cheat-row">
            <button class="cheat-btn ${godActive?'active':'danger'}" onclick="cheatToggleGodMode()">
              ${godActive ? "⚡ РЕЖИМ БОГА: ВКЛЮЧЁН (100% Побед)" : "⚡ Включить Режим Бога (Авто-победы)"}
            </button>
          </div>
          <div style="font-size:11.5px;color:var(--muted);margin-top:6px;">При включении: гарантия поулов и побед во всех гонках сезона!</div>
        </div>

        <div class="cheat-section">
          <div class="cheat-sec-title">Скорость болида <span>Текущая: ${myPerf}/100</span></div>
          <div class="cheat-row">
            <button class="cheat-btn" onclick="cheatAddCarPerf(3)">+3 к болиду</button>
            <button class="cheat-btn" onclick="cheatAddCarPerf(10)">+10 к болиду</button>
            <button class="cheat-btn gold" onclick="cheatSetCarPerf(99)">🏎️💨 Сделать болид ракетой (99/100)</button>
          </div>
        </div>

        <div class="cheat-section">
          <div class="cheat-sec-title">Мгновенный переход в команду (Роль №1)</div>
          <div class="cheat-team-grid" id="cheatTeamList"></div>
        </div>

        <div class="cheat-section">
          <div class="cheat-sec-title">Окно трансферов</div>
          <div class="cheat-row">
            <button class="cheat-btn gold" onclick="cheatSpawnMegaOffers()">📨 Заспавнить топ-предложения (Ferrari, Red Bull, McLaren)</button>
          </div>
        </div>
      `;

      // Fill teams
      const teamList = document.getElementById("cheatTeamList");
      if (teamList && typeof F1_TEAMS !== "undefined") {
        teamList.innerHTML = "";
        F1_TEAMS.forEach(t => {
          const b = document.createElement("button");
          b.className = "cheat-btn";
          b.style.borderLeft = "4px solid " + t.color;
          b.textContent = t.name;
          b.onclick = () => cheatTransferTeam(t.name);
          teamList.appendChild(b);
        });
      }
    } else if (currentTab === "tp") {
      const tpPrest = S.tpPrest || 50;
      const isOwner = !!(S.tpOwner && S.tpOwner.k === "self");
      box.innerHTML = `
        <div class="cheat-status">Режим TP: <b>${S.tpTeam || "Нет команды"}</b> · Сезон: <b>${yearNow()}</b> · Престиж: <b>${tpPrest}</b> · Владелец: <b>${isOwner ? "ДА (Своя команда)" : "НЕТ (Наёмный директор)"}</b></div>

        <div class="cheat-section">
          <div class="cheat-sec-title">Престиж и Совет директоров</div>
          <div class="cheat-row">
            <button class="cheat-btn gold" onclick="cheatTpMaxPrestige()">🌟 Престиж на МАКСИМУМ (99)</button>
            <button class="cheat-btn" onclick="cheatTpRestoreConfidence()">🤝 100% Доверие совета директоров</button>
            <button class="cheat-btn gold" onclick="cheatTpBecomeOwner()">👑 Стать полноправным владельцем команды</button>
          </div>
        </div>

        <div class="cheat-section">
          <div class="cheat-sec-title">Инфраструктура и болид команды</div>
          <div class="cheat-row">
            <button class="cheat-btn gold" onclick="cheatTpMaxCar()">🏎️ Прокачать болид команды до 99</button>
          </div>
        </div>

        <div class="cheat-section">
          <div class="cheat-sec-title">Стаж руководителя <span>Сезонов у руля: ${S.age || 0} / 65</span></div>
          <div class="cheat-row">
            <button class="cheat-btn" onclick="cheatTpAddSeasons(-5)">-5 сезонов</button>
            <button class="cheat-btn" onclick="cheatTpAddSeasons(1)">+1 сезон</button>
            <button class="cheat-btn" onclick="cheatTpAddSeasons(5)">+5 сезонов</button>
            <button class="cheat-btn gold" onclick="cheatTpSetSeasons(62)">62 сезона (Предпенсионный)</button>
            <button class="cheat-btn gold" onclick="cheatTpSetSeasons(65)">65 сезонов (Предел)</button>
          </div>
        </div>
      `;
    } else if (currentTab === "quick") {
      box.innerHTML = `
        <div class="cheat-status">Текущий сезон: <b>${yearNow()}</b> · Сыграно сезонов: <b>${(S.seasons || []).length}</b></div>

        <div class="cheat-section">
          <div class="cheat-sec-title">Календарный год и синхронизация <span>Текущий год: ${yearNow()}</span></div>
          <div class="cheat-row">
            <button class="cheat-btn" onclick="cheatAddYear(-1)">-1 год назад</button>
            <button class="cheat-btn" onclick="cheatAddYear(1)">+1 год вперёд</button>
            <button class="cheat-btn" onclick="cheatAddYear(5)">+5 лет вперёд</button>
            <button class="cheat-btn gold" onclick="cheatSyncYearWithSeasons()">🔄 Восстановить год по сыгранным сезонам (${(S.baseYear || 2026) + (S.seasons ? S.seasons.length : 0)})</button>
          </div>
        </div>

        <div class="cheat-section">
          <div class="cheat-sec-title">Управление сезоном и карьерой</div>
          <div class="cheat-row">
            <button class="cheat-btn gold" onclick="cheatInstantWinSeason()">🏆 Мгновенно стать чемпионом текущего сезона</button>
            <button class="cheat-btn danger" onclick="cheatInstantEndCareer()">🏁 Завершить карьеру сейчас (Открыть Зал Славы)</button>
          </div>
        </div>

        <div class="cheat-section">
          <div class="cheat-sec-title">Разблокировки игры</div>
          <div class="cheat-row">
            <button class="cheat-btn gold" onclick="cheatUnlockAllDecades()">🔓 Разблокировать все ретро-эпохи (1950–2020)</button>
            <button class="cheat-btn gold" onclick="closeCheatMenu(); window.transitionToCeoPage(false);">🏛️ Кабинет CEO и Владельца команды F1</button>
            <button class="cheat-btn danger" onclick="window.resetCeoMode(); notify('Состояние CEO полностью сброшено!');">🗑️ Сбросить команду CEO (resetCeoMode)</button>
            <button class="cheat-btn gold" onclick="cheatUnlockChallenges()">📅 Разблокировать все испытания</button>
            <button class="cheat-btn" onclick="cheatTogglePreview()">🧪 Preview-режим разработчика: ${typeof PREVIEW !== "undefined" && PREVIEW ? "ВКЛ" : "ВЫКЛ"}</button>
          </div>
        </div>
      `;
    }
  }

  // Cheat action implementations
  window.cheatAddOvr = function(delta) {
    if (!hasGame()) return;
    S.ovr = Math.min(99, Math.max(40, (S.ovr || 50) + delta));
    try { refreshCard(); } catch(e){}
    notify(`Рейтинг OVR изменён: ${S.ovr}`);
    renderCheatContent();
  };

  window.cheatSetOvr = function(val) {
    if (!hasGame()) return;
    S.ovr = Math.min(99, Math.max(40, val));
    try { refreshCard(); } catch(e){}
    notify(`Рейтинг OVR установлен: ${S.ovr}`);
    renderCheatContent();
  };

  window.cheatAddAge = function(delta) {
    if (!hasGame()) return;
    const curY = yearNow();
    S.age = Math.max(16, Math.min(65, (S.age || 20) + delta));
    S.startAge = S.age - (curY - (S.baseYear || 2026));
    try { refreshCard(); } catch(e){}
    notify(`Возраст изменён: ${S.age} (Год: ${yearNow()})`);
    renderCheatContent();
  };

  window.cheatSetAge = function(val) {
    if (!hasGame()) return;
    const curY = yearNow();
    S.age = Math.max(16, Math.min(65, val));
    S.startAge = S.age - (curY - (S.baseYear || 2026));
    try { refreshCard(); } catch(e){}
    notify(`Возраст установлен: ${S.age} (Год: ${yearNow()})`);
    renderCheatContent();
  };

  window.cheatTpAddSeasons = function(delta) {
    if (!hasGame()) return;
    const curY = yearNow();
    S.age = Math.max(0, Math.min(65, (S.age || 0) + delta));
    S.startAge = S.age - (curY - (S.baseYear || 2026));
    try { refreshCard(); } catch(e){}
    notify(`Стаж руководителя: ${S.age} сезонов (Год: ${yearNow()})`);
    renderCheatContent();
  };

  window.cheatTpSetSeasons = function(val) {
    if (!hasGame()) return;
    const curY = yearNow();
    S.age = Math.max(0, Math.min(65, val));
    S.startAge = S.age - (curY - (S.baseYear || 2026));
    try { refreshCard(); } catch(e){}
    notify(`Стаж руководителя установлен: ${S.age} сезонов (Год: ${yearNow()})`);
    renderCheatContent();
  };

  window.cheatAddYear = function(delta) {
    if (!hasGame()) return;
    const targetY = yearNow() + delta;
    S.startAge = (S.age || 20) - (targetY - (S.baseYear || 2026));
    try { refreshCard(); } catch(e){}
    notify(`Календарный год изменён: ${yearNow()} (Возраст: ${S.age})`);
    renderCheatContent();
  };

  window.cheatSyncYearWithSeasons = function() {
    if (!hasGame()) return;
    const seasonsCount = S.seasons ? S.seasons.length : 0;
    const targetYear = (S.baseYear || 2026) + seasonsCount;
    S.startAge = (S.age || 20) - (targetYear - (S.baseYear || 2026));
    try { refreshCard(); } catch(e){}
    notify(`Год синхронизирован: ${yearNow()} (по числу сезонов: ${seasonsCount})`);
    renderCheatContent();
  };

  window.cheatAddFame = function(delta) {
    if (!hasGame()) return;
    S.val = Math.max(0, (S.val || 10) + delta);
    try { refreshCard(); } catch(e){}
    notify(`Слава увеличена: ${Math.round(S.val)}`);
    renderCheatContent();
  };

  window.cheatSetMaxFame = function() {
    if (!hasGame()) return;
    S.val = 2500;
    try { refreshCard(); } catch(e){}
    notify("Статус: БЕССМЕРТНЫЙ (2500 славы)!");
    renderCheatContent();
  };

  window.cheatAddStat = function(stat, count) {
    if (!hasGame()) return;
    if (stat === "wins") S.wins = (S.wins || 0) + count;
    if (stat === "podiums") S.podiums = (S.podiums || 0) + count;
    if (stat === "poles") S.poles = (S.poles || 0) + count;
    if (stat === "titles") {
      S.titles = S.titles || { f1: 0, constr: 0, f2: 0, f3: 0 };
      S.titles.f1 = (S.titles.f1 || 0) + count;
    }
    try { refreshCard(); } catch(e){}
    notify(`Статистика обновлена!`);
    renderCheatContent();
  };

  window.cheatSetStyle = function(st) {
    if (typeof sel !== "undefined") {
      sel.style = st;
      try {
        ["agresivo","tecnico","consistente"].forEach(x => {
          const el = document.getElementById("st-" + x);
          if (el) el.classList.toggle("sel", x === st);
        });
        refreshCard();
      } catch(e){}
      notify(`Стиль пилотажа изменён: ${st}`);
      renderCheatContent();
    }
  };

  window.cheatClearBlacklists = function() {
    if (!hasGame()) return;
    S.burned = {};
    S.neverHire = {};
    notify("Чёрные списки команд очищены! Все команды снова открыты к переговорам.");
  };

  window.cheatHeal = function() {
    if (!hasGame()) return;
    S.missRaces = 0;
    S.crashRace = null;
    S.dnpSeason = false;
    S._tpBan = false;
    S.tpFiaDQCount = 0;
    notify("Травмы вылечены, баны FIA и пропуски гонок сброшены!");
  };

  window.cheatToggleGodMode = function() {
    if (!hasGame()) return;
    S._godMode = !S._godMode;
    notify(S._godMode ? "⚡ Режим Бога ВКЛЮЧЁН (100% побед)" : "Режим Бога выключен");
    renderCheatContent();
  };

  window.cheatAddCarPerf = function(delta) {
    if (!hasGame()) return;
    const teamName = (S.team && S.team.name) || S.tpTeam;
    if (!teamName) { notify("У вас нет команды"); return; }
    S.f1perf = S.f1perf || {};
    S.f1perf[teamName] = Math.min(99, Math.max(50, (S.f1perf[teamName] || 75) + delta));
    if (S.f1target) S.f1target[teamName] = S.f1perf[teamName];
    try { refreshCard(); } catch(e){}
    notify(`Скорость болида ${teamName}: ${Math.round(S.f1perf[teamName])}/100`);
    renderCheatContent();
  };

  window.cheatSetCarPerf = function(val) {
    if (!hasGame()) return;
    const teamName = (S.team && S.team.name) || S.tpTeam;
    if (!teamName) { notify("У вас нет команды"); return; }
    S.f1perf = S.f1perf || {};
    S.f1perf[teamName] = val;
    if (S.f1target) S.f1target[teamName] = val;
    try { refreshCard(); } catch(e){}
    notify(`Скорость болида ${teamName}: ${val}/100 🚀`);
    renderCheatContent();
  };

  window.cheatTransferTeam = function(teamName) {
    if (!hasGame()) return;
    const t = F1_TEAMS.find(x => x.name === teamName);
    if (!t) return;
    S.team = t;
    S.role = 1;
    S.cat = "F1";
    if (typeof occupySeat === "function") occupySeat(teamName);
    try { refreshCard(); renderF1State(); } catch(e){}
    notify(`Трансфер оформлен! Вы в ${teamName} (Роль №1)`);
    renderCheatContent();
  };

  window.cheatSpawnMegaOffers = function() {
    if (!hasGame()) return;
    const box = document.getElementById("offerList");
    if (!box) { notify("Окно предложений сейчас недоступно"); return; }
    const topTeams = F1_TEAMS.filter(t => ["Ferrari","Red Bull","McLaren","Mercedes"].includes(t.name));
    box.innerHTML = "";
    topTeams.forEach(t => {
      const b = document.createElement("button");
      b.className = "offer";
      b.style.border = "2px solid " + t.color;
      b.style.borderLeftWidth = "6px";
      b.innerHTML = `${badge(t,"dot")}<span class="info"><span class="name">Супер-контракт с ${t.name}</span>
        <span class="sub" style="display:block;color:var(--gold);font-weight:700">★ №1 Пилот · Контракт на 3 сезона · Высший статус</span></span>`;
      b.onclick = () => {
        S.team = t;
        S.role = 1;
        S.cat = "F1";
        if (typeof occupySeat === "function") occupySeat(t.name);
        try { refreshCard(); renderF1State(); } catch(e){}
        closeCheatMenu();
        if (typeof advanceYear === "function") advanceYear();
      };
      box.appendChild(b);
    });
    notify("Супер-предложения добавлены в список!");
    closeCheatMenu();
  };

  window.cheatTpMaxPrestige = function() {
    if (!hasGame()) return;
    S.tpPrest = 99;
    try { refreshCard(); } catch(e){}
    notify("Престиж руководителя установлен на 99 (MAX)!");
    renderCheatContent();
  };

  window.cheatTpRestoreConfidence = function() {
    if (!hasGame()) return;
    S.tpLastMet = true;
    S.tpMissStreak = 0;
    notify("Доверие совета директоров восстановлено до 100%!");
  };

  window.cheatTpBecomeOwner = function() {
    if (!hasGame()) return;
    S.tpOwner = { k: "self" };
    try { refreshCard(); } catch(e){}
    notify("Поздравляем! Теперь вы полноправный владелец команды 👑");
    renderCheatContent();
  };

  window.cheatTpMaxCar = function() {
    if (!hasGame() || !S.tpTeam) { notify("Сначала возглавьте команду в режиме TP"); return; }
    S.f1perf = S.f1perf || {};
    S.f1perf[S.tpTeam] = 99;
    if (S.f1target) S.f1target[S.tpTeam] = 99;
    notify(`Болид команды ${S.tpTeam} улучшен до 99/100!`);
  };

  window.cheatInstantWinSeason = function() {
    if (!hasGame()) return;
    S.titles = S.titles || { f1: 0, constr: 0, f2: 0, f3: 0 };
    S.titles.f1 += 1;
    S.titles.constr += 1;
    S.wins = (S.wins || 0) + 12;
    S.podiums = (S.podiums || 0) + 18;
    S.poles = (S.poles || 0) + 14;
    S.val = (S.val || 10) + 300;
    try { refreshCard(); renderTimeline(); } catch(e){}
    notify("🏆 Вы стали Чемпионом Мира и выиграли Кубок Конструкторов текущего сезона!");
    renderCheatContent();
  };

  window.cheatInstantEndCareer = function() {
    if (!hasGame()) return;
    closeCheatMenu();
    if (typeof endCareer === "function") {
      endCareer();
    }
  };

  window.cheatUnlockAllDecades = function() {
    document.querySelectorAll(".dec.locked").forEach(b => {
      b.classList.remove("locked");
      b.disabled = false;
    });
    // Remove badges/coming soon
    const notes = document.querySelectorAll(".dec-note");
    notes.forEach(n => n.style.display = "none");
    notify("Все ретро-эпохи разблокированы!");
  };

  window.cheatUnlockTPCard = function() {
    const card = document.getElementById("tpCard");
    if (card) {
      card.classList.remove("soon");
      card.classList.add("retro-on");
      card.onclick = () => {
        if (typeof startTPFlow === "function") startTPFlow("2026");
        else if (typeof retroModo === "function") retroModo("tp");
      };
      const badge = document.getElementById("badgeTP");
      if (badge) badge.style.display = "none";
    }
    notify("Режим Team Principal разблокирован!");
  };

  window.cheatUnlockChallenges = function() {
    const card = document.getElementById("challengeCard");
    if (card) {
      card.classList.remove("soon");
      card.classList.add("retro-on");
      card.onclick = () => {
        const grid = document.getElementById("challengeGrid");
        if (grid) grid.style.display = grid.style.display === "none" ? "grid" : "none";
      };
      const badge = document.getElementById("badgeReto");
      if (badge) badge.style.display = "none";
    }
    notify("Испытания разблокированы!");
  };

  window.cheatTogglePreview = function() {
    const cur = localStorage.getItem("f1g_preview") === "1";
    if (cur) {
      localStorage.removeItem("f1g_preview");
      notify("Режим Preview выключен. Перезагрузка страницы...");
    } else {
      localStorage.setItem("f1g_preview", "1");
      notify("Режим Preview ВКЛЮЧЁН! Перезагрузка страницы...");
    }
    setTimeout(() => { location.reload(); }, 600);
  };

  // Keyboard shortcut: F2 or Tilde (`) opens/closes cheat menu
  window.addEventListener("keydown", function(e) {
    if (e.key === "F2" || e.key === "`" || e.code === "Backquote") {
      // If typing in input, ignore
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      e.preventDefault();
      toggleCheatMenu();
    }
  });

  // Init on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureCheatModal);
  } else {
    ensureCheatModal();
  }
})();
