/* =====================================================================
   F1 Glory · Achievements, Helmet Customizer & Grand Prix Calendar
   Модуль достижений, редактора шлема и календаря трасс F1
   ===================================================================== */

(function(){
  // =====================================================================
  // 1. ACHIEVEMENTS DATABASE (22 FIA MILESTONES)
  // =====================================================================
  const ACHIEVEMENTS_DEF = [
    { id: "first_points", title: "Первые очки в элите", desc: "Финишировать в зачётной десятке Гран-при F1", ico: "🎯", points: 10 },
    { id: "first_podium", title: "Брызги шампанского", desc: "Впервые в карьере подняться на подиум F1", ico: "🍾", points: 20 },
    { id: "first_win", title: "Вкус победы", desc: "Одержать первую победу в Гран-при Формулы-1", ico: "🥇", points: 30 },
    { id: "first_pole", title: "Хозяин субботы", desc: "Завоевать свою первую поул-позицию", ico: "⏱️", points: 25 },
    { id: "world_champion", title: "Чемпион Мира F1", desc: "Завоевать титул чемпиона мира в личном зачёте", ico: "👑", points: 100 },
    { id: "multi_champion", title: "Многократный триумфатор", desc: "Выиграть 2 или более чемпионских титула", ico: "🏆", points: 150 },
    { id: "dynasty", title: "Эпоха величия", desc: "Завоевать 4 или более титулов чемпиона F1", ico: "⭐", points: 250 },
    { id: "rain_master", title: "Человек дождя", desc: "Выиграть гонку с техничным стилем пилотажа", ico: "🌧️", points: 40 },
    { id: "underdog_podium", title: "Чудо на ведре", desc: "Подняться на подиум на слабом болиде (Perf < 80)", ico: "🚀", points: 50 },
    { id: "monaco_king", title: "Король Монако", desc: "Выиграть легендарный Гран-при Монако", ico: "💎", points: 50 },
    { id: "triple_crown", title: "Тройная корона автоспорта", desc: "Покорить Монако, Инди 500 и 24 часа Ле-Мана", ico: "👑👑", points: 300 },
    { id: "centurion", title: "Центурион паддока", desc: "Провести 100 или более стартов в Гран-при F1", ico: "💯", points: 40 },
    { id: "club_300", title: "Клуб 300", desc: "Преодолеть отметку в 300 Гран-при (как Алонсо)", ico: "🏛️", points: 80 },
    { id: "teammate_slayer", title: "Гроза напарников", desc: "Одержать 5 сезонных побед над напарниками", ico: "⚔️", points: 60 },
    { id: "vintage_champion", title: "Как хорошее вино", desc: "Выиграть титул чемпиона в возрасте 36 лет или старше", ico: "🍷", points: 120 },
    { id: "ovr_elite", title: "Абсолютный пик", desc: "Достичь рейтинга мастерства 90+ OVR", ico: "⚡", points: 50 },
    { id: "ovr_legend", title: "Уровень Сенны и Шумахера", desc: "Достичь космического рейтинга 94+ OVR", ico: "🌟", points: 100 },
    { id: "constructor_glory", title: "Кубок конструкторов", desc: "Привести свою конюшню к победе в Кубке конструкторов", ico: "🏎️", points: 70 },
    { id: "tp_master", title: "Гений с пит-уолла", desc: "Выиграть оба титула в режиме Team Principal", ico: "👔", points: 150 },
    { id: "iron_driver", title: "Железный пилот", desc: "Провести 5 сезонов подряд без единого схода", ico: "🛡️", points: 40 },
    { id: "fame_immortal", title: "Бессмертное имя", desc: "Достичь наивысшего статуса славы «Бессмертный»", ico: "🔥", points: 60 },
    { id: "saved_career", title: "Хранитель истории", desc: "Использовать систему сохранений или экспорта карьеры", ico: "💾", points: 15 }
  ];

  function getUnlockedAchievements() {
    try {
      return JSON.parse(localStorage.getItem("f1g_achievements") || "{}");
    } catch(e){
      return {};
    }
  }

  function unlockAchievement(id) {
    const ach = ACHIEVEMENTS_DEF.find(a => a.id === id);
    if(!ach) return;
    const unlocked = getUnlockedAchievements();
    if(unlocked[id]) return; // already unlocked

    unlocked[id] = { unlockedAt: Date.now() };
    try {
      localStorage.setItem("f1g_achievements", JSON.stringify(unlocked));
    } catch(e){}

    showAchievementToast(ach);
  }

  function showAchievementToast(ach) {
    let t = document.getElementById("achToast");
    if(!t) {
      t = document.createElement("div");
      t.id = "achToast";
      document.body.appendChild(t);
    }
    t.innerHTML = `
      <div class="ach-t-ico">${ach.ico}</div>
      <div class="ach-t-body">
        <div class="ach-t-sub">🏆 ДОСТИЖЕНИЕ РАЗБЛОКИРОВАНО (+${ach.points} PTS)</div>
        <div class="ach-t-title">${ach.title}</div>
        <div class="ach-t-desc">${ach.desc}</div>
      </div>
    `;
    t.className = "ach-toast show";
    clearTimeout(t._timer);
    t._timer = setTimeout(() => {
      t.className = "ach-toast";
    }, 4500);
  }

  function checkF1Achievements() {
    if(typeof S === "undefined" || !S || !S.cat) return;

    if(S.ptsF1 > 0 || (S.seasons && S.seasons.some(s => s.cat === "F1" && s.pts > 0))) {
      unlockAchievement("first_points");
    }
    if((S.podiums || 0) >= 1) unlockAchievement("first_podium");
    if((S.wins || 0) >= 1) unlockAchievement("first_win");
    if((S.poles || 0) >= 1) unlockAchievement("first_pole");
    if((S.titles && S.titles.f1 >= 1)) unlockAchievement("world_champion");
    if((S.titles && S.titles.f1 >= 2)) unlockAchievement("multi_champion");
    if((S.titles && S.titles.f1 >= 4)) unlockAchievement("dynasty");
    if((S.titles && S.titles.constr >= 1)) unlockAchievement("constructor_glory");

    if((S.gp || 0) >= 100) unlockAchievement("centurion");
    if((S.gp || 0) >= 300) unlockAchievement("club_300");

    if((S.ovr || 0) >= 90) unlockAchievement("ovr_elite");
    if((S.ovr || 0) >= 94) unlockAchievement("ovr_legend");

    if(S.monacoWins >= 1) unlockAchievement("monaco_king");
    if(S.tripleCrown && S.tripleCrown.monaco && S.tripleCrown.indy && S.tripleCrown.lemans) {
      unlockAchievement("triple_crown");
    }

    if(S.titles && S.titles.f1 >= 1 && S.age >= 36) {
      unlockAchievement("vintage_champion");
    }

    if(S.cat === "TP" && S.titles && S.titles.f1 >= 1 && S.titles.constr >= 1) {
      unlockAchievement("tp_master");
    }

    // Teammate slayer
    let h2hWins = 0;
    (S.seasons || []).forEach(s => {
      if(s.cat === "F1" && s.mateName && ((s.pos < s.matePos) || (s.pts > (s.matePts || 0)))) {
        h2hWins++;
      }
    });
    if(h2hWins >= 5) unlockAchievement("teammate_slayer");
  }
  window.checkF1Achievements = checkF1Achievements;

  // =====================================================================
  // 2. HELMET CUSTOMIZER (SVG ENGINE)
  // =====================================================================
  const DEFAULT_HELMET = {
    base: "#e10600",
    accent: "#ffffff",
    visor: "#ffd700",
    pattern: "speed" // speed | stripes | bull | aero
  };

  function getHelmetConfig() {
    if(typeof sel !== "undefined" && sel.helmet) return sel.helmet;
    try {
      const saved = localStorage.getItem("f1g_user_helmet");
      if(saved) return JSON.parse(saved);
    } catch(e){}
    return { ...DEFAULT_HELMET };
  }

  function setHelmetConfig(cfg) {
    if(typeof sel !== "undefined") sel.helmet = cfg;
    try {
      localStorage.setItem("f1g_user_helmet", JSON.stringify(cfg));
    } catch(e){}
    updateHelmetDisplays();
  }

  function generateHelmetSVG(cfg, size = 32) {
    const c = cfg || getHelmetConfig();
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 64 64" class="f1-helmet-svg">
        <!-- Helmet Shell Base -->
        <path d="M12 36 C12 20 22 10 36 10 C50 10 56 22 56 36 C56 46 48 54 36 54 C24 54 12 48 12 36 Z" fill="${c.base}" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
        
        <!-- Aerodynamic Graphic Accent -->
        <path d="M16 28 C26 22 42 20 54 30 L52 38 C42 28 26 30 16 36 Z" fill="${c.accent}"/>
        
        <!-- Visor Opening & Shield -->
        <path d="M26 24 C36 22 46 24 52 32 L48 42 C40 38 30 38 24 40 Z" fill="${c.visor}" stroke="#111" stroke-width="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"/>
        
        <!-- Visor Reflection Highlight -->
        <path d="M28 27 C34 25 42 26 47 31" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round" fill="none"/>
        
        <!-- Chin Guard Air Intake -->
        <rect x="22" y="44" width="16" height="4" rx="2" fill="#1e293b"/>
        <line x1="26" y1="46" x2="34" y2="46" stroke="#fff" stroke-width="1" stroke-dasharray="2,2"/>
      </svg>
    `;
  }

  function updateHelmetDisplays() {
    const cfg = getHelmetConfig();
    const hudSlot = document.getElementById("hudHelmetSlot");
    if(hudSlot) hudSlot.innerHTML = generateHelmetSVG(cfg, 26);

    const cardSlot = document.getElementById("cardHelmetSlot");
    if(cardSlot) cardSlot.innerHTML = generateHelmetSVG(cfg, 64);
  }

  // =====================================================================
  // 3. GRAND PRIX CALENDAR & TRACK TELEMETRY DATABASE
  // =====================================================================
  const TRACKS_DB = [
    { name: "Альберт-Парк (Мельбурн)", country: "Австралия", flag: "🇦🇺", length: "5.278 км", laps: 58, type: "Полугородская", trait: "Высокая скорость, техничные связки", risk: "Средний" },
    { name: "Сахир (Бахрейн)", country: "Бахрейн", flag: "🇧🇭", length: "5.412 км", laps: 57, type: "Пустынный автодром", trait: "Торможения в шпильки, износ шин", risk: "Низкий" },
    { name: "Сузука", country: "Япония", flag: "🇯🇵", length: "5.807 км", laps: 53, type: "Фигурная восьмерка", trait: "Легендарные эски 'S-Curves', чистый пилотаж", risk: "Высокий" },
    { name: "Монте-Карло", country: "Монако", flag: "🇲🇨", length: "3.337 км", laps: 78, type: "Уличная жемчужина", trait: "Прижимная сила, барьеры в сантиметрах", risk: "Критический" },
    { name: "Жиль Вильнёв (Монреаль)", country: "Канада", flag: "🇨🇦", length: "4.361 км", laps: 70, type: "Стоп-энд-гоу", trait: "Стена чемпионов, жесткие торможения", risk: "Высокий" },
    { name: "Сильверстоун", country: "Великобритания", flag: "🇬🇧", length: "5.891 км", laps: 52, type: "Храм скорости", trait: "Связки Maggotts/Becketts, боковые перегрузки", risk: "Средний" },
    { name: "Спа-Франкоршам", country: "Бельгия", flag: "🇧🇪", length: "7.004 км", laps: 44, type: "Горные горки в Арденнах", trait: "Eau Rouge / Raidillon, частый ливень", risk: "Критический" },
    { name: "Монца", country: "Италия", flag: "🇮🇹", length: "5.793 км", laps: 53, type: "Храм скорости тифози", trait: "Минимальное крыло, максимальная скорость 350+ км/ч", risk: "Средний" },
    { name: "Марина-Бэй", country: "Сингапур", flag: "🇸🇬", length: "4.940 км", laps: 62, type: "Ночная городская жара", trait: "100% влажность, 23 поворота под фонарями", risk: "Высокий" },
    { name: "Интерлагос (Сан-Паулу)", country: "Бразилия", flag: "🇧🇷", length: "4.309 км", laps: 71, type: "Против часовой стрелки", trait: "Внезапные грозы, 'S' Сенны", risk: "Высокий" },
    { name: "Яс Марина", country: "Абу-Даби", flag: "🇦🇪", length: "5.281 км", laps: 58, type: "Сумеречный финал", trait: "Гонка день-ночь, борьба за титул", risk: "Низкий" }
  ];

  // =====================================================================
  // MODALS GENERATION & UI INJECTIONS
  // =====================================================================

  // 1. Achievements Modal
  function createAchievementsModalDOM() {
    if(document.getElementById("achModal")) return;
    const m = document.createElement("div");
    m.id = "achModal";
    m.className = "f1-modal-overlay";
    m.innerHTML = `
      <div class="f1-modal-card ach-card">
        <div class="ach-head">
          <div>
            <span class="f1-mono-sub">FIA CAREER TROPHIES & ACHIEVEMENTS</span>
            <h2>🏆 <span data-ru="Витрина Достижений F1" data-en="Career Milestones">Витрина Достижений</span></h2>
          </div>
          <button class="rank-x" onclick="closeAchievementsModal()">✕</button>
        </div>

        <div class="ach-progress-bar-wrap">
          <div class="ach-progress-info">
            <span id="achUnlockedCount">0 из 22 разблокировано</span>
            <span id="achPointsTotal">0 очков FIA</span>
          </div>
          <div class="ach-progress-line"><div class="ach-progress-fill" id="achProgressFill"></div></div>
        </div>

        <div class="ach-grid" id="achGrid"></div>
      </div>
    `;
    document.body.appendChild(m);
    m.addEventListener("click", e => { if(e.target === m) closeAchievementsModal(); });
  }

  function renderAchievementsModal() {
    createAchievementsModalDOM();
    const grid = document.getElementById("achGrid");
    if(!grid) return;
    checkF1Achievements();

    const unlocked = getUnlockedAchievements();
    const total = ACHIEVEMENTS_DEF.length;
    let unlockedCount = 0;
    let points = 0;

    const cards = ACHIEVEMENTS_DEF.map(a => {
      const isUn = !!unlocked[a.id];
      if(isUn) {
        unlockedCount++;
        points += a.points;
      }
      return `
        <div class="ach-item ${isUn ? 'unlocked' : 'locked'}">
          <div class="ach-item-ico">${a.ico}</div>
          <div class="ach-item-info">
            <div class="ach-item-title">${a.title}</div>
            <div class="ach-item-desc">${a.desc}</div>
            <div class="ach-item-pts">+${a.points} PTS ${isUn ? '· ✅ ПОЛУЧЕНО' : '· 🔒 ЗАКРЫТО'}</div>
          </div>
        </div>
      `;
    });

    document.getElementById("achUnlockedCount").textContent = `${unlockedCount} из ${total} разблокировано`;
    document.getElementById("achPointsTotal").textContent = `${points} очков славы FIA`;
    document.getElementById("achProgressFill").style.width = `${Math.round((unlockedCount / total) * 100)}%`;
    grid.innerHTML = cards.join("");
  }

  window.openAchievementsModal = function() {
    renderAchievementsModal();
    const m = document.getElementById("achModal");
    if(m) m.style.display = "flex";
  };
  window.closeAchievementsModal = function() {
    const m = document.getElementById("achModal");
    if(m) m.style.display = "none";
  };

  // 2. Helmet Customizer Modal
  function createHelmetModalDOM() {
    if(document.getElementById("helmetModal")) return;
    const m = document.createElement("div");
    m.id = "helmetModal";
    m.className = "f1-modal-overlay";
    m.innerHTML = `
      <div class="f1-modal-card helmet-card">
        <div class="helmet-head">
          <div>
            <span class="f1-mono-sub">PERSONAL DRIVER IDENTITY // HELMET DESIGNER</span>
            <h2>🪖 <span data-ru="Редактор Шлема Пилота" data-en="Helmet Customizer">Редактор Шлема Пилота</span></h2>
          </div>
          <button class="rank-x" onclick="closeHelmetModal()">✕</button>
        </div>

        <div class="helmet-modal-body">
          <div class="helmet-preview-box" id="helmetModalPreview"></div>

          <div class="helmet-controls-grid">
            <div class="h-ctrl">
              <label>Основной цвет купола</label>
              <div class="color-presets" id="baseColorPresets"></div>
            </div>
            <div class="h-ctrl">
              <label>Цвет гоночной полосы</label>
              <div class="color-presets" id="accentColorPresets"></div>
            </div>
            <div class="h-ctrl">
              <label>Визор и антиблик</label>
              <div class="color-presets" id="visorColorPresets"></div>
            </div>
          </div>
        </div>

        <div class="helmet-actions">
          <button class="btn" onclick="saveHelmetSettings()">💾 Применить раскраску</button>
          <button class="btn ghost" onclick="closeHelmetModal()">Отмена</button>
        </div>
      </div>
    `;
    document.body.appendChild(m);
    m.addEventListener("click", e => { if(e.target === m) closeHelmetModal(); });
  }

  let tempHelmetCfg = { ...DEFAULT_HELMET };

  function renderHelmetModal() {
    createHelmetModalDOM();
    tempHelmetCfg = { ...getHelmetConfig() };

    const preview = document.getElementById("helmetModalPreview");
    if(preview) preview.innerHTML = generateHelmetSVG(tempHelmetCfg, 128);

    const baseColors = ["#e10600", "#ffffff", "#0f172a", "#ffd700", "#0284c7", "#10b981", "#ff7a00", "#8b5cf6"];
    const accentColors = ["#ffffff", "#ffd700", "#e10600", "#000000", "#38bdf8", "#10b981", "#f43f5e"];
    const visorColors = ["#ffd700", "#1e293b", "#38bdf8", "#f43f5e", "#10b981", "#a855f7"];

    renderColorPicker("baseColorPresets", baseColors, tempHelmetCfg.base, c => {
      tempHelmetCfg.base = c;
      preview.innerHTML = generateHelmetSVG(tempHelmetCfg, 128);
    });
    renderColorPicker("accentColorPresets", accentColors, tempHelmetCfg.accent, c => {
      tempHelmetCfg.accent = c;
      preview.innerHTML = generateHelmetSVG(tempHelmetCfg, 128);
    });
    renderColorPicker("visorColorPresets", visorColors, tempHelmetCfg.visor, c => {
      tempHelmetCfg.visor = c;
      preview.innerHTML = generateHelmetSVG(tempHelmetCfg, 128);
    });
  }

  function renderColorPicker(containerId, colors, selected, onSelect) {
    const el = document.getElementById(containerId);
    if(!el) return;
    el.innerHTML = colors.map(c => `
      <button class="color-swatch ${c===selected?'selected':''}" style="background:${c}" onclick="this.parentNode.querySelectorAll('.color-swatch').forEach(s=>s.classList.remove('selected'));this.classList.add('selected');(${onSelect})('${c}')"></button>
    `).join("");
  }

  window.openHelmetModal = function() {
    renderHelmetModal();
    const m = document.getElementById("helmetModal");
    if(m) m.style.display = "flex";
  };
  window.closeHelmetModal = function() {
    const m = document.getElementById("helmetModal");
    if(m) m.style.display = "none";
  };
  window.saveHelmetSettings = function() {
    setHelmetConfig(tempHelmetCfg);
    closeHelmetModal();
    if(window.showF1Toast) window.showF1Toast("Раскраска шлема обновлена!", "success");
  };

  // 3. Calendar Modal
  function createCalendarModalDOM() {
    if(document.getElementById("calendarModal")) return;
    const m = document.createElement("div");
    m.id = "calendarModal";
    m.className = "f1-modal-overlay";
    m.innerHTML = `
      <div class="f1-modal-card calendar-card">
        <div class="calendar-head">
          <div>
            <span class="f1-mono-sub">FIA WORLD CHAMPIONSHIP // OFFICIAL VENUES</span>
            <h2>🏁 <span data-ru="Календарь Чемпионата и Трассы" data-en="Championship Tracks">Календарь Чемпионата F1</span></h2>
          </div>
          <button class="rank-x" onclick="closeCalendarModal()">✕</button>
        </div>

        <div class="calendar-grid-list">
          ${TRACKS_DB.map((t, idx) => `
            <div class="track-row">
              <div class="track-round">ROUND ${idx + 1}</div>
              <div class="track-main">
                <div class="track-title"><span class="track-flag">${t.flag}</span> <b>${t.name}</b> <small>(${t.country})</small></div>
                <div class="track-meta">
                  <span>📏 ${t.length}</span> · 
                  <span>🔄 ${t.laps} кругов</span> · 
                  <span class="track-type">${t.type}</span>
                </div>
                <div class="track-trait">${t.trait}</div>
              </div>
              <div class="track-risk-badge risk-${t.risk.toLowerCase()}">Риск: ${t.risk}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    document.body.appendChild(m);
    m.addEventListener("click", e => { if(e.target === m) closeCalendarModal(); });
  }

  window.openCalendarModal = function() {
    createCalendarModalDOM();
    const m = document.getElementById("calendarModal");
    if(m) m.style.display = "flex";
  };
  window.closeCalendarModal = function() {
    const m = document.getElementById("calendarModal");
    if(m) m.style.display = "none";
  };

  // =====================================================================
  // INITIALIZATION HOOKS
  // =====================================================================
  function initModuleUI() {
    createAchievementsModalDOM();
    createHelmetModalDOM();
    createCalendarModalDOM();

    // 1. Add helmet slot in career HUD
    const hudLeft = document.querySelector(".career-hud .hud-left");
    if(hudLeft && !document.getElementById("hudHelmetSlot")) {
      const slot = document.createElement("span");
      slot.id = "hudHelmetSlot";
      slot.className = "hud-helmet-slot";
      slot.title = "Редактор шлема (кликните)";
      slot.onclick = openHelmetModal;
      hudLeft.insertBefore(slot, hudLeft.firstChild);
    }

    // 2. Add extra buttons to driverCardExtraBtns
    const actWrap = document.getElementById("driverCardExtraBtns");
    if(actWrap && !document.getElementById("btnHelmetDriver")) {
      const bHelm = document.createElement("button");
      bHelm.id = "btnHelmetDriver";
      bHelm.className = "btn ghost btn-extra-tool";
      bHelm.innerHTML = "🪖 Шлем";
      bHelm.onclick = openHelmetModal;
      actWrap.appendChild(bHelm);

      const bAch = document.createElement("button");
      bAch.id = "btnAchDriver";
      bAch.className = "btn ghost btn-extra-tool";
      bAch.innerHTML = "🏆 Достижения";
      bAch.onclick = openAchievementsModal;
      actWrap.appendChild(bAch);

      const bCal = document.createElement("button");
      bCal.id = "btnCalDriver";
      bCal.className = "btn ghost btn-extra-tool";
      bCal.innerHTML = "🏁 Трассы";
      bCal.onclick = openCalendarModal;
      actWrap.appendChild(bCal);
    }

    // 3. Add link in intro
    const introLinks = document.querySelector(".intro-links");
    if(introLinks && !document.getElementById("introAchLink")) {
      const sep = document.createElement("span");
      sep.className = "il-sep";
      sep.textContent = "·";
      const aAch = document.createElement("a");
      aAch.id = "introAchLink";
      aAch.onclick = openAchievementsModal;
      aAch.textContent = "🏆 Достижения";
      introLinks.appendChild(sep);
      introLinks.appendChild(aAch);

      const sep2 = document.createElement("span");
      sep2.className = "il-sep";
      sep2.textContent = "·";
      const aCal = document.createElement("a");
      aCal.id = "introCalLink";
      aCal.onclick = openCalendarModal;
      aCal.textContent = "🏁 Трассы";
      introLinks.appendChild(sep2);
      introLinks.appendChild(aCal);
    }

    updateHelmetDisplays();
  }

  // Hook into season finish
  const origTimeline = window.renderTimeline;
  window.renderTimeline = function() {
    if(typeof origTimeline === "function") origTimeline.apply(this, arguments);
    try { checkF1Achievements(); } catch(e){}
  };

  if(document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initModuleUI);
  } else {
    initModuleUI();
  }
})();
