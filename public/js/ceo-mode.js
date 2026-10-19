/* =====================================================================
   F1 Glory · Team Owner & CEO Mode (Режим Владельца и CEO команды F1)
   Управление купленной конюшней, кадровая политика, увольнение инженеров,
   совет директоров, моторы, спонсоры и борьба за Кубок Конструкторов
   ===================================================================== */

(function(){
  // --- Initial Default CEO State ---
  const DEFAULT_TECH_DIRECTORS = [
    { id: "td_vandenberg", name: "Маркус Ванденберг", skill: 72, salary: 6500000, trait: "Консервативная аэродинамика", desc: "Опытный, но осторожный конструктор старой школы. Редко ошибается с надежностью, но не дает прорывов в прижимной силе." },
    { id: "td_newmann", name: "Эдриан Нойманн", skill: 96, salary: 22000000, trait: "Гений граунд-эффекта", desc: "Легендарный аэродинамик мирового уровня. Разработал 12 чемпионских болидов. Дает взрывной прирост темпа машины (+15 perf)." },
    { id: "td_elliott", name: "Джеймс Эллиотт", skill: 88, salary: 14000000, trait: "Мастер инноваций CFD", desc: "Экс-шеф аэродинамики топ-конюшни. Превосходный баланс между максимальной скоростью в поворотах и надежностью подвески (+10 perf)." },
    { id: "td_mariani", name: "Лука Мариани", skill: 81, salary: 9500000, trait: "Шеф-дизайнер из Маранелло", desc: "Итальянский специалист по компоновке шасси и охлаждению. Агрессивный дизайн понтонов (+7 perf)." },
    { id: "td_sokolov", name: "Виктор Соколов", skill: 76, salary: 4500000, trait: "Молодой визионер симуляций", desc: "Восходящая звезда университетских программ аэродинамики. Доступный оклад и высокий потенциал долгосрочного роста (+5 perf)." }
  ];

  const DEFAULT_TEAM_PRINCIPALS = [
    { id: "tp_dorn", name: "Алекс Дорн", skill: 77, salary: 5000000, trait: "Прагматичный менеджер", desc: "Держит железную дисциплину на пит-лейн и контролирует операционные расходы." },
    { id: "tp_horner_type", name: "Кристиан Вольфрам", skill: 93, salary: 16000000, trait: "Акула паддока и FIA", desc: "Умеет продавливать любые регламентные директивы в FIA и привлекать звездных инженеров." },
    { id: "tp_steiner_type", name: "Гюнтер Бауэр", skill: 80, salary: 6000000, trait: "Любимец прессы и шоу", desc: "Прямолинейный харизматик. Поднимает медийность команды на 300% и держит гараж в тонусе." },
    { id: "tp_ex_champ", name: "Мика Салонен", skill: 84, salary: 9000000, trait: "Бывший чемпион мира", desc: "Превосходно понимает психологию пилотов и знает, как наладить обратную связь с инженерами." }
  ];

  const ENGINE_SUPPLIERS = [
    { id: "eng_mercedes", name: "Mercedes-AMG HPP V6 Turbo", cost: 22000000, power: 94, rel: 95, tag: "Эталон надежности" },
    { id: "eng_ferrari", name: "Ferrari 066/12 Power Unit", cost: 21000000, power: 96, rel: 88, tag: "Максимальная пиковая мощность" },
    { id: "eng_rbpt", name: "Red Bull Powertrains - Ford", cost: 23000000, power: 95, rel: 92, tag: "Передовая ERS-гибридизация" },
    { id: "eng_honda", name: "Honda HRC Hybrid", cost: 19000000, power: 92, rel: 94, tag: "Высокая энергоэффективность" },
    { id: "eng_audi", name: "Audi Works Turbo Hybrid", cost: 17000000, power: 88, rel: 86, tag: "Заводской дебютант" }
  ];

  const TITLE_SPONSORS = [
    { id: "sp_tech", name: "Apex Global Cloud Systems", payout: 42000000, tag: "Технологический гигант", reqPos: 6 },
    { id: "sp_oil", name: "PetroDyn Energy International", payout: 48000000, tag: "Нефтегазовый конгломерат", reqPos: 4 },
    { id: "sp_crypto", name: "Nexus Web3 Exchange", payout: 34000000, tag: "Крипто-биржа", reqPos: 8 },
    { id: "sp_telecom", name: "Velox Telecom 5G", payout: 28000000, tag: "Телекоммуникации", reqPos: 10 }
  ];

  const DRIVER_CANDIDATES = [
    { id: "drv_bearman", name: "Оливер Берман", ovr: 84, salary: 11000000, isPay: false, tag: "Звездный молодой талант" },
    { id: "drv_norris_tier", name: "Ландо Вудринг", ovr: 92, salary: 26000000, isPay: false, tag: "Претендент на чемпионский титул" },
    { id: "drv_piastri_tier", name: "Оскар Ванден", ovr: 89, salary: 18000000, isPay: false, tag: "Хладнокровный победитель Гран-при" },
    { id: "drv_rookie_fast", name: "Артур Леклерк", ovr: 78, salary: 5000000, isPay: false, tag: "Выпускник академии" },
    { id: "drv_pay_latifi", name: "Николас Ричмонд", ovr: 68, salary: -24000000, isPay: true, tag: "Рента-драйвер (+ $24M спонсоров)" },
    { id: "drv_pay_zhou", name: "Чжоу Тянь", ovr: 74, salary: -18000000, isPay: true, tag: "Коммерческий пилот (+ $18M)" }
  ];

  const HQ_LOCATIONS = [
    { id: "silverstone", name: "Сильверстоун", country: "Великобритания", flag: "🇬🇧", desc: "Сердце Моторспорт-долины, доступ к лучшим инженерам F1" },
    { id: "maranello", name: "Болонья / Фаэнца", country: "Италия", flag: "🇮🇹", desc: "Итальянские традиции, страсть и аэродинамический дизайн" },
    { id: "stuttgart", name: "Штутгарт / Кёльн", country: "Германия", flag: "🇩🇪", desc: "Немецкие заводские технологии, автоклавы и педантичность" },
    { id: "charlotte", name: "Шарлотт / Остин", country: "США", flag: "🇺🇸", desc: "Американский капитал, медийный размах и цифровые симуляторы" },
    { id: "hinwil", name: "Хинвил", country: "Швейцария", flag: "🇨🇭", desc: "Швейцарская точность и одна из лучших в мире аэродинамических труб" },
    { id: "viry", name: "Вири-Шатийон / Ницца", country: "Франция", flag: "🇫🇷", desc: "Французская школа моторостроения и композитов" }
  ];

  const LIVERY_PALETTES = [
    { id: "teal", name: "Petronas Teal", primary: "#00d2be", preview: "linear-gradient(135deg, #00d2be 0%, #0f172a 75%)" },
    { id: "red", name: "Corsa Rosso", primary: "#e10600", preview: "linear-gradient(135deg, #e10600 0%, #1e1b18 75%)" },
    { id: "papaya", name: "Papaya Orange", primary: "#ff8700", preview: "linear-gradient(135deg, #ff8700 0%, #0369a1 75%)" },
    { id: "green", name: "British Racing Green", primary: "#00593b", preview: "linear-gradient(135deg, #00593b 0%, #022c22 75%)" },
    { id: "gulf", name: "Gulf Sky Blue", primary: "#38bdf8", preview: "linear-gradient(135deg, #38bdf8 0%, #ea580c 75%)" },
    { id: "gold", name: "Carbon & Midnight Gold", primary: "#d4af37", preview: "linear-gradient(135deg, #d4af37 0%, #09090b 75%)" },
    { id: "purple", name: "Ultraviolet Purple", primary: "#a855f7", preview: "linear-gradient(135deg, #a855f7 0%, #1e1b4b 75%)" },
    { id: "white", name: "Alpine Blue & White", primary: "#0090ff", preview: "linear-gradient(135deg, #0090ff 0%, #f8fafc 75%)" }
  ];

  const ORIGIN_STORIES = [
    { id: "buyout", title: "Выкуп команды-аутсайдера", tag: "Сделка поглощения", desc: "Поглощение существующей конюшни с её базой, лицензией FIA и долгами. Полный ребрендинг и перезапуск концепции." },
    { id: "new_team", title: "Создание новой 11-й команды", tag: "Новая франшиза FIA", desc: "Официальное внесение вступительного взноса ($200M) и регистрация нового конструктора Формулы-1 с чистого листа." },
    { id: "revival", title: "Возрождение культового бренда", tag: "Историческое наследие", desc: "Выкуп прав на легендарное историческое имя из золотой эпохи автоспорта (Brabham, Tyrrell, Lotus) и возвращение в паддок." }
  ];

  function getDefaultTeamName() {
    let base = "Shelby";
    if(typeof pName === "function" && pName()) {
      const parts = pName().trim().split(/\s+/);
      base = parts[parts.length - 1];
    } else if(typeof S !== "undefined" && S && S.name) {
      const parts = S.name.trim().split(/\s+/);
      base = parts[parts.length - 1];
    }
    return base + " F1 Team";
  }

  function getTeamNamePresets() {
    let sn = "Shelby";
    if(typeof pName === "function" && pName()) {
      const parts = pName().trim().split(/\s+/);
      sn = parts[parts.length - 1];
    } else if(typeof S !== "undefined" && S && S.name) {
      const parts = S.name.trim().split(/\s+/);
      sn = parts[parts.length - 1];
    }
    return [
      `${sn} F1 Team`,
      `Scuderia ${sn}`,
      `${sn} Grand Prix`,
      `Apex Formula Racing`,
      `Andretti Global`,
      `Brabham Racing`,
      `Audi Sport F1`
    ];
  }

  let CEO_STATE = null;

  function initCeoState() {
    let teamName = getDefaultTeamName();
    if(typeof S !== "undefined" && S && S.team && S.team.name) {
      teamName = S.team.name + " Racing";
    }

    CEO_STATE = {
      teamName: teamName,
      teamHq: "Сильверстоун (Великобритания)",
      teamFlag: "🇬🇧",
      teamColor: "#00d2be",
      teamLivery: "teal",
      teamStory: "Выкуп команды-аутсайдера",
      year: (typeof yearNow === "function" ? yearNow() : 2026),
      seasonNum: 1,
      budget: 85000000,
      marketCap: 920000000,
      boardApproval: 82, // 0 - 100%
      carPerf: 74,
      carRel: 86,
      techDirector: Object.assign({}, DEFAULT_TECH_DIRECTORS[0]),
      teamPrincipal: Object.assign({}, DEFAULT_TEAM_PRINCIPALS[0]),
      engine: Object.assign({}, ENGINE_SUPPLIERS[0]),
      sponsor: Object.assign({}, TITLE_SPONSORS[3]),
      driver1: Object.assign({}, DRIVER_CANDIDATES[0]),
      driver2: Object.assign({}, DRIVER_CANDIDATES[5]), // pay driver by default for financial balance
      facilities: {
        windTunnel: 2, // 1..5
        cfdSupercomputer: 2,
        simulator: 2,
        compositeFactory: 2
      },
      history: [],
      lastSeasonSummary: null
    };

    saveCeoState();
  }

  function saveCeoState() {
    try {
      if(CEO_STATE && CEO_STATE.history && CEO_STATE.history.length > 25) {
        CEO_STATE.history.length = 25;
      }
      localStorage.setItem("f1g_ceo_state", JSON.stringify(CEO_STATE));
    } catch(e) {}
  }

  function loadCeoState() {
    try {
      const saved = localStorage.getItem("f1g_ceo_state");
      if(saved) {
        CEO_STATE = JSON.parse(saved);
      }
    } catch(e){}
    if(!CEO_STATE) initCeoState();
  }

  function formatMoney(num) {
    if(Math.abs(num) >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if(Math.abs(num) >= 1000) return `$${Math.round(num / 1000)}K`;
    return `$${num}`;
  }

  // =====================================================================
  // ACTIONS: FIRE / HIRE TECH DIRECTORS, PRINCIPALS & UPGRADES
  // =====================================================================

  function fireTechDirector() {
    if(!CEO_STATE) loadCeoState();
    const oldName = CEO_STATE.techDirector ? CEO_STATE.techDirector.name : "Главный инженер";

    // Show candidate picker
    openStaffMarketModal("tech_director", oldName);
  }

  function fireTeamPrincipal() {
    if(!CEO_STATE) loadCeoState();
    const oldName = CEO_STATE.teamPrincipal ? CEO_STATE.teamPrincipal.name : "Руководитель команды";
    openStaffMarketModal("team_principal", oldName);
  }

  window.closeCeoStaffMarketModal = function() {
    const m = document.getElementById("ceoStaffMarketModal");
    if(m) {
      m.style.display = "none";
      m.innerHTML = "";
    }
  };

  function openStaffMarketModal(type, firedName) {
    let m = document.getElementById("ceoStaffMarketModal");
    if(!m) {
      m = document.createElement("div");
      m.id = "ceoStaffMarketModal";
      m.className = "f1-modal-overlay";
      m.addEventListener("click", e => { if(e.target === m) window.closeCeoStaffMarketModal(); });
      document.body.appendChild(m);
    }

    const isTD = (type === "tech_director");
    const title = isTD ? "⚠️ ОТСТАВКА И ВЫБОР ГЛАВНОГО ТЕХНИЧЕСКОГО ДИРЕКТОРА" : "⚠️ СМЕНА РУКОВОДИТЕЛЯ КОМАНДЫ (TEAM PRINCIPAL)";
    const list = isTD ? DEFAULT_TECH_DIRECTORS : DEFAULT_TEAM_PRINCIPALS;

    m.innerHTML = `
      <div class="f1-modal-card ceo-market-card">
        <div class="wealth-head">
          <div>
            <span class="f1-mono-sub">BOARD OF DIRECTORS EXECUTIVE DECISION</span>
            <h2>${title}</h2>
          </div>
          <button class="rank-x" onclick="window.closeCeoStaffMarketModal()">✕</button>
        </div>

        <div class="ceo-market-banner">
          <div class="cmb-alert">
            <span class="cmb-icon">🏛️</span>
            <div>
              <div class="cmb-title">РЕШЕНИЕ СОВЕТА ДИРЕКТОРОВ // КАДРОВАЯ РОТАЦИЯ</div>
              <div class="cmb-sub">Специалист <b>${firedName}</b> отправлен в отставку. Выберите преемника для подписания контракта:</div>
            </div>
          </div>
        </div>

        <div class="ceo-candidates-grid">
          ${list.map(cand => {
            const isCurrent = (isTD ? CEO_STATE.techDirector.id === cand.id : CEO_STATE.teamPrincipal.id === cand.id);
            const canAfford = CEO_STATE.budget >= cand.salary;
            return `
              <div class="ceo-candidate-card ${isCurrent ? 'current' : ''}">
                <div class="cc-head">
                  <span class="cc-trait">${cand.trait}</span>
                  <span class="cc-skill">Рейтинг: <b>${cand.skill}</b>/100</span>
                </div>
                <div class="cc-name">${cand.name}</div>
                <div class="cc-desc">${cand.desc}</div>
                <div class="cc-salary">Оклад: <b>${formatMoney(cand.salary)} / сезон</b></div>
                <div class="cc-actions">
                  ${isCurrent ? `
                    <div class="cc-active-badge">ДЕЙСТВУЮЩИЙ КОНТРАКТ</div>
                  ` : `
                    <button class="btn s-btn ${canAfford ? 'sc-buy' : 'sc-locked'}" onclick="window.hireStaffCandidate('${type}', '${cand.id}')" ${!canAfford ? 'disabled' : ''}>
                      ${canAfford ? 'Подписать контракт' : 'Превышает бюджет'}
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    m.style.display = "flex";
  }

  window.hireStaffCandidate = function(type, id) {
    if(!CEO_STATE) loadCeoState();
    if(type === "tech_director") {
      const cand = DEFAULT_TECH_DIRECTORS.find(c => c.id === id);
      if(!cand) return;
      CEO_STATE.techDirector = Object.assign({}, cand);
      // Recalculate car perf bump based on skill
      CEO_STATE.carPerf = Math.min(99, Math.max(65, Math.round(60 + (cand.skill - 65) * 0.9 + (CEO_STATE.facilities.windTunnel * 2.5))));
      if(window.showF1Toast) window.showF1Toast(`🏛️ ${cand.name} назначен главным техническим директором! Конструкторское бюро переходит под его руководство!`, "success");
    } else {
      const cand = DEFAULT_TEAM_PRINCIPALS.find(c => c.id === id);
      if(!cand) return;
      CEO_STATE.teamPrincipal = Object.assign({}, cand);
      CEO_STATE.boardApproval = Math.min(100, CEO_STATE.boardApproval + 6);
      if(window.showF1Toast) window.showF1Toast(`👔 ${cand.name} возглавил командный мостик в роли Team Principal!`, "success");
    }

    saveCeoState();
    window.closeCeoStaffMarketModal();
    renderCeoModal();
  };

  window.closeCeoDriverMarketModal = function() {
    const m = document.getElementById("ceoDriverMarketModal");
    if(m) {
      m.style.display = "none";
      m.innerHTML = "";
    }
  };

  function openDriverMarketModal(seatIndex) {
    let m = document.getElementById("ceoDriverMarketModal");
    if(!m) {
      m = document.createElement("div");
      m.id = "ceoDriverMarketModal";
      m.className = "f1-modal-overlay";
      m.addEventListener("click", e => { if(e.target === m) window.closeCeoDriverMarketModal(); });
      document.body.appendChild(m);
    }

    const currentDriver = (seatIndex === 1 ? CEO_STATE.driver1 : CEO_STATE.driver2);
    m.innerHTML = `
      <div class="f1-modal-card ceo-market-card">
        <div class="wealth-head">
          <div>
            <span class="f1-mono-sub">DRIVER LINEUP MANAGEMENT</span>
            <h2>🏎️ СМЕНА ПИЛОТА КОКПИТА #${seatIndex}</h2>
          </div>
          <button class="rank-x" onclick="window.closeCeoDriverMarketModal()">✕</button>
        </div>

        <div class="ceo-market-banner">
          <div class="cmb-alert">
            <span class="cmb-icon">🏎️</span>
            <div>
              <div class="cmb-title">ТРАНСФЕРНЫЙ РЫНОК // КОКПИТ #${seatIndex}</div>
              <div class="cmb-sub">Текущий пилот: <b>${currentDriver.name}</b> (${currentDriver.ovr} OVR, ${currentDriver.isPay ? `Рента-спонсоры: +${formatMoney(Math.abs(currentDriver.salary))}` : `Оклад: ${formatMoney(currentDriver.salary)}`}). Выберите контракт:</div>
            </div>
          </div>
        </div>

        <div class="ceo-candidates-grid">
          ${DRIVER_CANDIDATES.map(cand => {
            const isCurrent = (currentDriver.id === cand.id);
            const isPay = cand.isPay;
            return `
              <div class="ceo-candidate-card ${isCurrent ? 'current' : ''}">
                <div class="cc-head">
                  <span class="cc-trait ${isPay ? 'pay-trait' : ''}">${cand.tag}</span>
                  <span class="cc-skill">OVR: <b>${cand.ovr}</b></span>
                </div>
                <div class="cc-name">${cand.name}</div>
                <div class="cc-salary ${isPay ? 'pay-money' : ''}">
                  ${isPay ? `💰 Приносит команде: <b>+${formatMoney(Math.abs(cand.salary))}</b> / сезон` : `Оклад пилота: <b>${formatMoney(cand.salary)}</b> / сезон`}
                </div>
                <div class="cc-actions">
                  ${isCurrent ? `
                    <div class="cc-active-badge">ДЕЙСТВУЮЩИЙ ПИЛОТ</div>
                  ` : `
                    <button class="btn s-btn ${isPay ? 'asset-buy' : 'sc-buy'}" onclick="window.signDriverToSeat(${seatIndex}, '${cand.id}')">
                      Подписать в кокпит #${seatIndex}
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    m.style.display = "flex";
  }

  window.signDriverToSeat = function(seatIndex, drvId) {
    if(!CEO_STATE) loadCeoState();
    const cand = DRIVER_CANDIDATES.find(c => c.id === drvId);
    if(!cand) return;

    if(seatIndex === 1) CEO_STATE.driver1 = Object.assign({}, cand);
    else CEO_STATE.driver2 = Object.assign({}, cand);

    saveCeoState();
    window.closeCeoDriverMarketModal();
    if(window.showF1Toast) window.showF1Toast(`🏁 ${cand.name} подписан в кокпит #${seatIndex}!`, "success");
    renderCeoModal();
  };

  // Facility Upgrades
  function upgradeFacility(facKey) {
    if(!CEO_STATE) loadCeoState();
    const currentLvl = CEO_STATE.facilities[facKey] || 1;
    if(currentLvl >= 5) {
      if(window.showF1Toast) window.showF1Toast("Данный объект модернизирован до максимального уровня (Tier 5)!", "info");
      return;
    }

    const cost = (currentLvl + 1) * 12000000;
    if(CEO_STATE.budget < cost) {
      if(window.showF1Toast) window.showF1Toast(`Недостаточно средств для модернизации! Требуется ${formatMoney(cost)}.`, "error");
      return;
    }

    CEO_STATE.budget -= cost;
    CEO_STATE.facilities[facKey] = currentLvl + 1;
    CEO_STATE.marketCap += Math.round(cost * 1.5); // Infrastructure directly increases enterprise value

    if(facKey === "windTunnel" || facKey === "cfdSupercomputer") {
      CEO_STATE.carPerf = Math.min(99, CEO_STATE.carPerf + 4);
    } else {
      CEO_STATE.carRel = Math.min(99, CEO_STATE.carRel + 4);
    }

    saveCeoState();
    if(window.showF1Toast) window.showF1Toast(`🏗️ Модернизация завершена! Уровень поднят до Tier ${CEO_STATE.facilities[facKey]}!`, "success");
    renderCeoModal();
  }

  // =====================================================================
  // SIMULATION: RUN FULL 24 GP FORMULA 1 SEASON
  // =====================================================================
  function simulateCeoSeason() {
    if(!CEO_STATE) loadCeoState();

    // 1. Calculate final team pace index
    const tdSkill = (CEO_STATE.techDirector && CEO_STATE.techDirector.skill) || 75;
    const engPower = (CEO_STATE.engine && CEO_STATE.engine.power) || 90;
    const engRel = (CEO_STATE.engine && CEO_STATE.engine.rel) || 90;
    const facBonus = (CEO_STATE.facilities.windTunnel + CEO_STATE.facilities.cfdSupercomputer) * 2;

    const basePace = (tdSkill * 0.35) + (engPower * 0.35) + facBonus + (CEO_STATE.carPerf * 0.2);
    
    // Drivers influence
    const d1Skill = (CEO_STATE.driver1 && CEO_STATE.driver1.ovr) || 80;
    const d2Skill = (CEO_STATE.driver2 && CEO_STATE.driver2.ovr) || 75;
    const teamOvrPace = (basePace * 0.7) + (((d1Skill + d2Skill) / 2) * 0.3);

    // 2. Determine WCC Position (1 to 10)
    // Benchmarks: 93+ = P1-P2, 88+ = P3-P4, 82+ = P5-P6, 76+ = P7-P8, <76 = P9-P10
    let wccPos = 10;
    if(teamOvrPace >= 93) wccPos = Math.random() < 0.6 ? 1 : 2;
    else if(teamOvrPace >= 88) wccPos = Math.random() < 0.5 ? 3 : 4;
    else if(teamOvrPace >= 83) wccPos = Math.random() < 0.5 ? 5 : 6;
    else if(teamOvrPace >= 78) wccPos = Math.random() < 0.5 ? 7 : 8;
    else wccPos = Math.random() < 0.5 ? 9 : 10;

    // Reliability penalties
    const totalRel = (engRel * 0.5) + (CEO_STATE.carRel * 0.5);
    const dnfs = Math.max(1, Math.round((100 - totalRel) / 4) + Math.floor(Math.random() * 3));

    // Points, wins, podiums
    let wccPoints = 0;
    let wins = 0;
    let podiums = 0;

    if(wccPos === 1) { wccPoints = 580 + Math.floor(Math.random() * 80); wins = 12 + Math.floor(Math.random() * 6); podiums = 28 + Math.floor(Math.random() * 8); }
    else if(wccPos === 2) { wccPoints = 460 + Math.floor(Math.random() * 70); wins = 6 + Math.floor(Math.random() * 5); podiums = 20 + Math.floor(Math.random() * 6); }
    else if(wccPos === 3) { wccPoints = 350 + Math.floor(Math.random() * 60); wins = 2 + Math.floor(Math.random() * 4); podiums = 14 + Math.floor(Math.random() * 5); }
    else if(wccPos === 4) { wccPoints = 260 + Math.floor(Math.random() * 50); wins = Math.floor(Math.random() * 2); podiums = 8 + Math.floor(Math.random() * 4); }
    else if(wccPos === 5) { wccPoints = 170 + Math.floor(Math.random() * 40); podiums = Math.floor(Math.random() * 3); }
    else if(wccPos === 6) { wccPoints = 110 + Math.floor(Math.random() * 30); podiums = Math.floor(Math.random() * 2); }
    else if(wccPos === 7) { wccPoints = 65 + Math.floor(Math.random() * 25); }
    else if(wccPos === 8) { wccPoints = 35 + Math.floor(Math.random() * 15); }
    else if(wccPos === 9) { wccPoints = 14 + Math.floor(Math.random() * 10); }
    else { wccPoints = 2 + Math.floor(Math.random() * 6); }

    // 3. FOM Prize Money based on WCC Position
    // P1 = $140M, P2 = $130M, P3 = $120M, P4 = $110M, P5 = $100M, P6 = $90M, P7 = $80M, P8 = $75M, P9 = $70M, P10 = $65M
    const fomPrize = 145000000 - (wccPos * 8000000);
    const sponsorPayout = (CEO_STATE.sponsor && CEO_STATE.sponsor.payout) || 30000000;
    const payDriverMoney = (CEO_STATE.driver2 && CEO_STATE.driver2.isPay ? Math.abs(CEO_STATE.driver2.salary) : 0);

    const totalIncome = fomPrize + sponsorPayout + payDriverMoney;

    // Expenses
    const engCost = (CEO_STATE.engine && CEO_STATE.engine.cost) || 20000000;
    const tdSalary = (CEO_STATE.techDirector && CEO_STATE.techDirector.salary) || 6000000;
    const tpSalary = (CEO_STATE.teamPrincipal && CEO_STATE.teamPrincipal.salary) || 5000000;
    const d1Salary = (CEO_STATE.driver1 && !CEO_STATE.driver1.isPay ? CEO_STATE.driver1.salary : 0);
    const d2Salary = (CEO_STATE.driver2 && !CEO_STATE.driver2.isPay ? CEO_STATE.driver2.salary : 0);
    const factoryOps = 32000000; // Base factory operation within $135M cost cap

    const totalExpenses = engCost + tdSalary + tpSalary + d1Salary + d2Salary + factoryOps;
    const netProfit = totalIncome - totalExpenses;

    CEO_STATE.budget += netProfit;

    // 4. Board of Directors Evaluation
    let boardDelta = 0;
    let boardComment = "";
    if(wccPos === 1) {
      boardDelta = +18;
      boardComment = "🏆 ЧЕМПИОНЫ МИРА! Совет директоров единогласно выражает вам безусловное доверие и выписывает премиальный бонус!";
      CEO_STATE.marketCap += 280000000;
    } else if(wccPos <= 3) {
      boardDelta = +12;
      boardComment = "🍾 Подиумный финиш в Кубке Конструкторов! Акционеры в восторге от спортивных результатов и капитализации бренда.";
      CEO_STATE.marketCap += 140000000;
    } else if(wccPos <= 5) {
      boardDelta = +4;
      boardComment = "Плотная борьба в топ-5. Бюджет соблюден, спонсоры удовлетворены эфирным временем.";
      CEO_STATE.marketCap += 40000000;
    } else if(wccPos <= 8) {
      boardDelta = -8;
      boardComment = "⚠️ Результат ниже ожиданий инвесторов. Акционеры требуют немедленно разобраться с темпом обновлений машины!";
      CEO_STATE.marketCap -= 20000000;
    } else {
      boardDelta = -18;
      boardComment = "🚨 КАТАСТРОФА В КУБКЕ КОНСТРУКТОРОВ! Худший результат в пелотоне. Совет директоров требует немедленной отставки главного инженера!";
      CEO_STATE.marketCap -= 70000000;
    }

    if(netProfit < -10000000) {
      boardDelta -= 8;
      boardComment += " Также совет обеспокоен финансовым дефицитом сезона.";
    }

    CEO_STATE.boardApproval = Math.max(10, Math.min(100, CEO_STATE.boardApproval + boardDelta));

    // Season summary object
    const summary = {
      seasonNum: CEO_STATE.seasonNum,
      year: CEO_STATE.year,
      wccPos: wccPos,
      wccPoints: wccPoints,
      wins: wins,
      podiums: podiums,
      dnfs: dnfs,
      income: totalIncome,
      expenses: totalExpenses,
      profit: netProfit,
      boardApproval: CEO_STATE.boardApproval,
      boardComment: boardComment,
      recommendedFiring: (wccPos >= 8)
    };

    CEO_STATE.history.unshift(summary);
    if(CEO_STATE.history.length > 25) {
      CEO_STATE.history.length = 25; // Limit history to prevent memory leak and storage bloat
    }
    CEO_STATE.lastSeasonSummary = summary;
    CEO_STATE.seasonNum += 1;
    CEO_STATE.year += 1;

    saveCeoState();
    renderCeoModal();
    openSeasonDebriefModal(summary);
  }

  window.closeCeoDebriefModal = function() {
    const m = document.getElementById("ceoDebriefModal");
    if(m) {
      m.style.display = "none";
      m.innerHTML = "";
    }
  };

  function openSeasonDebriefModal(summary) {
    let m = document.getElementById("ceoDebriefModal");
    if(!m) {
      m = document.createElement("div");
      m.id = "ceoDebriefModal";
      m.className = "f1-modal-overlay";
      m.addEventListener("click", e => { if(e.target === m) window.closeCeoDebriefModal(); });
      document.body.appendChild(m);
    }

    const isSuccess = (summary.wccPos <= 3);
    const isCrisis = (summary.wccPos >= 8);

    m.innerHTML = `
      <div class="f1-modal-card ceo-debrief-card">
        <div class="wealth-head">
          <div>
            <span class="f1-mono-sub">ANNUAL FIA CONSTRUCTORS CHAMPIONSHIP REVIEW</span>
            <h2>🏁 ИТОГИ СЕЗОНА ${summary.year - 1} · СОВЕТ ДИРЕКТОРОВ</h2>
          </div>
          <button class="rank-x" onclick="window.closeCeoDebriefModal()">✕</button>
        </div>

        <div class="ceo-debrief-hero ${isSuccess ? 'hero-gold' : isCrisis ? 'hero-crisis' : ''}">
          <div class="cdh-pos">P${summary.wccPos}</div>
          <div class="cdh-details">
            <div class="cdh-wcc">Кубок Конструкторов FIA Formula 1</div>
            <div class="cdh-stats">
              <span>Очки: <b>${summary.wccPoints}</b></span> · 
              <span>Победы: <b>${summary.wins}</b></span> · 
              <span>Подиумы: <b>${summary.podiums}</b></span> · 
              <span>Сходы: <b>${summary.dnfs}</b></span>
            </div>
          </div>
        </div>

        <div class="ceo-finance-breakdown">
          <div class="cfb-box">
            <span class="cfb-lbl">ПРИЗОВЫЕ FOM + СПОНСОРЫ</span>
            <div class="cfb-val cfb-green">+${formatMoney(summary.income)}</div>
          </div>
          <div class="cfb-box">
            <span class="cfb-lbl">РАСХОДЫ (ОКЛАДЫ, МОТОР, ЗАВОД)</span>
            <div class="cfb-val cfb-red">-${formatMoney(summary.expenses)}</div>
          </div>
          <div class="cfb-box">
            <span class="cfb-lbl">ЧИСТАЯ ПРИБЫЛЬ / УБЫТОК</span>
            <div class="cfb-val ${summary.profit >= 0 ? 'cfb-gold' : 'cfb-red'}">${summary.profit >= 0 ? '+' : ''}${formatMoney(summary.profit)}</div>
          </div>
        </div>

        <div class="ceo-board-verdict-box ${isCrisis ? 'crisis' : ''}">
          <div class="cbv-title">🏛️ РЕЗОЛЮЦИЯ СОВЕТА АКЦИОНЕРОВ (Одобрение: ${summary.boardApproval}%)</div>
          <div class="cbv-text">${summary.boardComment}</div>
        </div>

        <div class="ceo-debrief-actions">
          ${summary.recommendedFiring ? `
            <button class="btn s-btn ceo-fire-btn" onclick="window.closeCeoDebriefModal(); window.fireCeoTechDirector();">
              ⚠️ УВОЛИТЬ ГЛАВНОГО ИНЖЕНЕРА (СОВЕТ НАСТАИВАЕТ)
            </button>
          ` : ''}
          <button class="btn s-btn sc-buy" onclick="window.closeCeoDebriefModal()">
            ПРОДОЛЖИТЬ В КАБИНЕТ CEO
          </button>
        </div>
      </div>
    `;

    m.style.display = "flex";
  }

  // =====================================================================
  // TEAM CREATION & REBRANDING MODAL
  // =====================================================================
  let tempTeamData = {
    name: "",
    hqId: "silverstone",
    liveryId: "teal",
    storyId: "buyout"
  };

  window.closeTeamCreationModal = function() {
    const m = document.getElementById("teamCreationModal");
    if(m) {
      m.style.display = "none";
      m.innerHTML = "";
    }
  };

  function openTeamCreationModal(isEditing) {
    if(!CEO_STATE) loadCeoState();

    tempTeamData = {
      name: CEO_STATE.teamName || getDefaultTeamName(),
      hqId: (HQ_LOCATIONS.find(h => (CEO_STATE.teamHq || '').includes(h.name)) || HQ_LOCATIONS[0]).id,
      liveryId: CEO_STATE.teamLivery || "teal",
      storyId: (ORIGIN_STORIES.find(s => s.title === CEO_STATE.teamStory) || ORIGIN_STORIES[0]).id
    };

    let m = document.getElementById("teamCreationModal");
    if(!m) {
      m = document.createElement("div");
      m.id = "teamCreationModal";
      m.className = "f1-modal-overlay";
      m.addEventListener("click", e => { if(e.target === m) window.closeTeamCreationModal(); });
      document.body.appendChild(m);
    }

    renderTeamCreationModal(isEditing);
    m.style.display = "flex";
  }

  function renderTeamCreationModal(isEditing) {
    const m = document.getElementById("teamCreationModal");
    if(!m) return;

    const hq = HQ_LOCATIONS.find(h => h.id === tempTeamData.hqId) || HQ_LOCATIONS[0];
    const livery = LIVERY_PALETTES.find(l => l.id === tempTeamData.liveryId) || LIVERY_PALETTES[0];
    const story = ORIGIN_STORIES.find(s => s.id === tempTeamData.storyId) || ORIGIN_STORIES[0];
    const presets = getTeamNamePresets();

    m.innerHTML = `
      <div class="f1-modal-card team-creation-card">
        <div class="wealth-head">
          <div>
            <span class="f1-mono-sub">FIA CONSTRUCTOR ENTRY & BRAND IDENTITY</span>
            <h2>${isEditing ? '✏️ РЕБРЕНДИНГ И НАСТРОЙКА КОМАНДЫ' : '🏛️ УЧРЕЖДЕНИЕ И БРЕНДИНГ КОМАНДЫ ФОРМУЛЫ-1'}</h2>
          </div>
          <button class="rank-x" onclick="window.closeTeamCreationModal()">✕</button>
        </div>

        <div class="tc-modal-body">
          <!-- Live Preview Banner -->
          <div class="tc-preview-card" style="background: ${livery.preview};">
            <div class="tcp-top">
              <span class="tcp-lic">FIA SUPER ENTRY // LICENSED CONSTRUCTOR</span>
              <span class="tcp-flag">${hq.flag}</span>
            </div>
            <div class="tcp-name">${tempTeamData.name || 'Shelby F1 Team'}</div>
            <div class="tcp-bottom">
              <span class="tcp-hq">📍 ${hq.name} (${hq.country})</span>
              <span class="tcp-story">${story.title}</span>
            </div>
          </div>

          <!-- Section 1: Team Name & Presets -->
          <div class="tc-section">
            <label class="tc-label">НАЗВАНИЕ КОНЮШНИ (TEAM NAME)</label>
            <input type="text" id="tcInputName" class="f1-text-input tc-name-input" maxlength="32" value="${tempTeamData.name}" oninput="window.updateTcName(this.value)" placeholder="Например: Shelby F1 Team">
            <div class="tc-presets-label">БЫСТРЫЕ ВАРИАНТЫ:</div>
            <div class="tc-presets-strip">
              ${presets.map(p => `
                <button type="button" class="tc-preset-chip" onclick="window.applyTcPreset('${p}')">${p}</button>
              `).join("")}
            </div>
          </div>

          <!-- Section 2: Headquarters & Country -->
          <div class="tc-section">
            <label class="tc-label">ШТАБ-КВАРТИРА И СТРАНА РЕГИСТРАЦИИ (HQ & LICENSE)</label>
            <div class="tc-hq-grid">
              ${HQ_LOCATIONS.map(h => {
                const isSel = (h.id === tempTeamData.hqId);
                return `
                  <div class="tc-hq-card ${isSel ? 'selected' : ''}" onclick="window.setTcHq('${h.id}')">
                    <div class="thc-head">
                      <span class="thc-flag">${h.flag}</span>
                      <span class="thc-name">${h.name}</span>
                    </div>
                    <div class="thc-country">${h.country}</div>
                    <div class="thc-desc">${h.desc}</div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- Section 3: Livery Palette -->
          <div class="tc-section">
            <label class="tc-label">ФИРМЕННАЯ РАСЦВЕТКА И ЛИВРЕЯ БОЛИДА</label>
            <div class="tc-livery-strip">
              ${LIVERY_PALETTES.map(l => {
                const isSel = (l.id === tempTeamData.liveryId);
                return `
                  <div class="tc-livery-chip ${isSel ? 'selected' : ''}" onclick="window.setTcLivery('${l.id}')">
                    <span class="tc-color-dot" style="background: ${l.primary};"></span>
                    <span class="tc-color-name">${l.name}</span>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- Section 4: Origin Story -->
          <div class="tc-section">
            <label class="tc-label">ИСТОРИЯ ПРИХОДА В ЧЕМПИОНАТ (TEAM ORIGIN)</label>
            <div class="tc-story-grid">
              ${ORIGIN_STORIES.map(s => {
                const isSel = (s.id === tempTeamData.storyId);
                return `
                  <div class="tc-story-card ${isSel ? 'selected' : ''}" onclick="window.setTcStory('${s.id}')">
                    <div class="tsc-tag">${s.tag}</div>
                    <div class="tsc-title">${s.title}</div>
                    <div class="tsc-desc">${s.desc}</div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        </div>

        <div class="tc-modal-footer">
          <button class="btn btn-ceo-confirm" onclick="window.confirmTeamCreation(${isEditing})">
            🏛️ ${isEditing ? 'СОХРАНИТЬ ИЗМЕНЕНИЯ И ВЕРНУТЬСЯ' : 'УТВЕРДИТЬ В FIA И ПРИНЯТЬ УПРАВЛЕНИЕ КОМАНДОЙ'}
          </button>
        </div>
      </div>
    `;
  }

  // =====================================================================
  // MAIN CEO DASHBOARD MODAL
  // =====================================================================
  let activeCeoTab = "overview"; // "overview", "factory", "board"

  function createCeoModalDOM() {
    if(document.getElementById("ceoModal")) return;
    const m = document.createElement("div");
    m.id = "ceoModal";
    m.className = "f1-modal-overlay";
    m.innerHTML = `
      <div class="f1-modal-card ceo-main-card">
        <div class="wealth-head ceo-head">
          <div>
            <span class="f1-mono-sub">FIA FORMULA 1 CONSTRUCTOR · CHAIR OF THE BOARD & CEO</span>
            <div class="ceo-title-row">
              <h2 id="ceoTeamTitle"><span id="ceoTeamFlagVal">🇬🇧</span> <span id="ceoTeamNameVal">Shelby F1 Team</span></h2>
              <button class="ceo-edit-brand-btn" onclick="window.openTeamCreationModal(true)" title="Ребрендинг команды, смена названия и ливреи">✏️ Настроить бренд</button>
            </div>
            <div class="ceo-hq-sub" id="ceoTeamHqVal">📍 База: Сильверстоун (Великобритания) · Ливрея: Petronas Teal</div>
          </div>
          <button class="rank-x" onclick="closeCeoModal()">✕</button>
        </div>

        <!-- Metric KPI Cards -->
        <div class="ceo-kpi-banner">
          <div class="ceo-kpi-box">
            <span class="wb-lbl">БЮДЖЕТ КОМАНДЫ</span>
            <div class="wb-val" id="ceoBudgetVal">$0</div>
          </div>
          <div class="ceo-kpi-box">
            <span class="wb-lbl">КАПИТАЛИЗАЦИЯ ФРАНШИЗЫ</span>
            <div class="wb-val val-blue" id="ceoMarketCapVal">$0</div>
          </div>
          <div class="ceo-kpi-box">
            <span class="wb-lbl">ДОВЕРИЕ СОВЕТА ДИРЕКТОРОВ</span>
            <div class="wb-val val-gold" id="ceoApprovalVal">80%</div>
          </div>
          <div class="ceo-kpi-box">
            <span class="wb-lbl">СЕЗОН ЧЕМПИОНАТА</span>
            <div class="wb-val" id="ceoSeasonVal">Сезон 1 · 2026</div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="wealth-nav-tabs">
          <button class="wealth-tab-btn active" id="tabCeoOverview" onclick="switchCeoTab('overview')">📊 Штаб и Пилоты</button>
          <button class="wealth-tab-btn" id="tabCeoFactory" onclick="switchCeoTab('factory')">🏭 Инфраструктура завода и Мотор</button>
          <button class="wealth-tab-btn" id="tabCeoBoard" onclick="switchCeoTab('board')">🏛️ История и Совет акционеров</button>
        </div>

        <div class="ceo-body" id="ceoTabContent"></div>

        <!-- Footer Control Bar -->
        <div class="ceo-footer-bar">
          <button class="btn s-btn btn-ceo-sim" onclick="window.runCeoSeasonSimulation()">
            🏁 <b>СИМУЛИРОВАТЬ СЕЗОН ЧЕМПИОНАТА (24 ГРАН-ПРИ)</b>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(m);
    m.addEventListener("click", e => { if(e.target === m) closeCeoModal(); });
  }

  function renderCeoModal() {
    createCeoModalDOM();
    if(!CEO_STATE) loadCeoState();

    document.getElementById("ceoTeamFlagVal").textContent = CEO_STATE.teamFlag || "🇬🇧";
    document.getElementById("ceoTeamNameVal").textContent = CEO_STATE.teamName;
    const liveryObj = LIVERY_PALETTES.find(l => l.id === CEO_STATE.teamLivery) || LIVERY_PALETTES[0];
    document.getElementById("ceoTeamHqVal").textContent = `📍 База: ${CEO_STATE.teamHq || 'Сильверстоун (Великобритания)'} · Ливрея: ${liveryObj.name}`;

    document.getElementById("ceoBudgetVal").textContent = formatMoney(CEO_STATE.budget);
    document.getElementById("ceoMarketCapVal").textContent = formatMoney(CEO_STATE.marketCap);
    document.getElementById("ceoApprovalVal").textContent = `${CEO_STATE.boardApproval}%`;
    document.getElementById("ceoSeasonVal").textContent = `Сезон ${CEO_STATE.seasonNum} · ${CEO_STATE.year}`;

    // Update tab buttons
    ["overview", "factory", "board"].forEach(t => {
      const btn = document.getElementById("tabCeo" + t.charAt(0).toUpperCase() + t.slice(1));
      if(btn) {
        if(t === activeCeoTab) btn.classList.add("active");
        else btn.classList.remove("active");
      }
    });

    const body = document.getElementById("ceoTabContent");
    if(!body) return;

    // Free previous tab DOM nodes before rendering new tab
    body.textContent = "";

    if(activeCeoTab === "overview") {
      renderOverviewTab(body);
    } else if(activeCeoTab === "factory") {
      renderFactoryTab(body);
    } else {
      renderBoardTab(body);
    }
  }

  function renderOverviewTab(container) {
    const td = CEO_STATE.techDirector;
    const tp = CEO_STATE.teamPrincipal;
    const d1 = CEO_STATE.driver1;
    const d2 = CEO_STATE.driver2;

    container.innerHTML = `
      <div class="ceo-content-stack">
        <!-- Car Telemetry Card -->
        <div class="ceo-car-hero">
          <div class="cch-head">
            <div class="cch-title-wrap">
              <span class="f1-mono-sub">CHASSIS & AERODYNAMICS TELEMETRY</span>
              <div class="cch-title">🏎️ БОЛИД ЧЕМПИОНАТА // ТЕМП И НАДЕЖНОСТЬ</div>
            </div>
            <div class="cch-quick-tags">
              <span class="cch-tag">Мотор: <b>${CEO_STATE.engine ? CEO_STATE.engine.name.split(' ')[0] : 'F1'}</b></span>
              <span class="cch-tag">Труба: <b>Tier ${CEO_STATE.facilities.windTunnel}/5</b></span>
              <span class="cch-tag">CFD: <b>Tier ${CEO_STATE.facilities.cfdSupercomputer}/5</b></span>
            </div>
          </div>

          <div class="cch-meters">
            <div class="cch-meter-item">
              <div class="cch-lbl-row">
                <span>Скорость в поворотах и прижимная сила (Car Performance)</span>
                <b>${CEO_STATE.carPerf} <small>/ 100</small></b>
              </div>
              <div class="cch-bar-track">
                <div class="cch-bar-fill cch-fill-teal" style="width: ${CEO_STATE.carPerf}%;"></div>
              </div>
            </div>

            <div class="cch-meter-item">
              <div class="cch-lbl-row">
                <span>Механическая надежность шасси и силовой установки (Reliability)</span>
                <b>${CEO_STATE.carRel}%</b>
              </div>
              <div class="cch-bar-track">
                <div class="cch-bar-fill cch-fill-green" style="width: ${CEO_STATE.carRel}%;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2x2 Executive Suite -->
        <div class="ceo-exec-grid">
          <!-- 1. Chief Technical Officer (CTO) -->
          <div class="ceo-exec-card staff-cto ${td.skill >= 90 ? 'elite' : ''}">
            <div class="cec-top">
              <span class="cec-role-badge badge-cto">🛠️ ГЛАВНЫЙ ИНЖЕНЕР (CTO)</span>
              <span class="cec-salary">${formatMoney(td.salary)}/год</span>
            </div>
            <div class="cec-name">${td.name}</div>
            <div class="cec-pills">
              <span class="cec-pill">Рейтинг: <b>${td.skill}/100</b></span>
              <span class="cec-pill trait-pill">${td.trait}</span>
            </div>
            <div class="cec-desc">${td.desc || "Руководит конструкторским бюро и отвечает за аэродинамический пакет болида."}</div>
            <div class="cec-footer">
              <button class="btn ceo-fire-btn" onclick="window.fireCeoTechDirector()">
                ⚠️ УВОЛИТЬ ГЛАВНОГО ИНЖЕНЕРА
              </button>
            </div>
          </div>

          <!-- 2. Team Principal (TP) -->
          <div class="ceo-exec-card staff-tp">
            <div class="cec-top">
              <span class="cec-role-badge badge-tp">👔 РУКОВОДИТЕЛЬ КОМАНДЫ (TP)</span>
              <span class="cec-salary">${formatMoney(tp.salary)}/год</span>
            </div>
            <div class="cec-name">${tp.name}</div>
            <div class="cec-pills">
              <span class="cec-pill">Авторитет в FIA: <b>${tp.skill}/100</b></span>
              <span class="cec-pill trait-pill">${tp.trait}</span>
            </div>
            <div class="cec-desc">${tp.desc || "Контролирует пит-лейн, политику в паддоке и операционную работу гаража."}</div>
            <div class="cec-footer">
              <button class="btn ceo-neutral-btn" onclick="window.fireCeoTeamPrincipal()">
                Сменить Team Principal
              </button>
            </div>
          </div>

          <!-- 3. Driver 1 (Lead Driver) -->
          <div class="ceo-exec-card driver-lead">
            <div class="cec-top">
              <span class="cec-role-badge badge-d1">🏁 ПИЛОТ №1 (ЛИДЕР)</span>
              <span class="cec-salary">${formatMoney(d1.salary)}/год</span>
            </div>
            <div class="cec-name">${d1.name}</div>
            <div class="cec-pills">
              <span class="cec-pill">Мастерство: <b>${d1.ovr} OVR</b></span>
              <span class="cec-pill trait-pill">${d1.tag}</span>
            </div>
            <div class="cec-desc">Главная ударная сила команды в борьбе за победы и очки в Личном зачёте.</div>
            <div class="cec-footer">
              <button class="btn ceo-neutral-btn" onclick="window.openCeoDriverMarket(1)">
                Сменить пилота №1
              </button>
            </div>
          </div>

          <!-- 4. Driver 2 (Second Driver / Pay Driver) -->
          <div class="ceo-exec-card driver-second ${d2.isPay ? 'pay-card' : ''}">
            <div class="cec-top">
              <span class="cec-role-badge ${d2.isPay ? 'badge-pay' : 'badge-d2'}">
                ${d2.isPay ? '💰 ПИЛОТ №2 (PAY DRIVER)' : '🏁 ПИЛОТ №2 (ВТОРОЙ НОМЕР)'}
              </span>
              <span class="cec-salary ${d2.isPay ? 'pay-green' : ''}">
                ${d2.isPay ? `+${formatMoney(Math.abs(d2.salary))}/год` : `${formatMoney(d2.salary)}/год`}
              </span>
            </div>
            <div class="cec-name">${d2.name}</div>
            <div class="cec-pills">
              <span class="cec-pill">Мастерство: <b>${d2.ovr} OVR</b></span>
              <span class="cec-pill trait-pill">${d2.tag}</span>
            </div>
            <div class="cec-desc">
              ${d2.isPay ? 'Приносит спонсорские миллионы в бюджет конюшни, помогая компенсировать лимит расходов.' : 'Надежный второй пилот для набора очков в Кубок Конструкторов.'}
            </div>
            <div class="cec-footer">
              <button class="btn ${d2.isPay ? 'ceo-pay-btn' : 'ceo-neutral-btn'}" onclick="window.openCeoDriverMarket(2)">
                Сменить пилота №2
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderFactoryTab(container) {
    const currentEng = CEO_STATE.engine;
    const currentSp = CEO_STATE.sponsor;
    const fac = CEO_STATE.facilities;

    const renderPips = (lvl) => {
      let pips = '';
      for(let i = 1; i <= 5; i++) {
        pips += `<span class="fac-pip ${i <= lvl ? 'filled' : ''}"></span>`;
      }
      return pips;
    };

    container.innerHTML = `
      <div class="ceo-factory-layout">
        <!-- Section: Engine Partners -->
        <div class="ceo-sec-block">
          <div class="csb-header">
            <div>
              <span class="f1-mono-sub">POWER UNIT ALLIANCE</span>
              <h3>🔧 ПОСТАВЩИК СИЛОВОЙ УСТАНОВКИ V6 TURBO HYBRID</h3>
            </div>
          </div>
          <div class="ceo-engines-strip">
            ${ENGINE_SUPPLIERS.map(e => {
              const isSelected = (currentEng.id === e.id);
              return `
                <div class="ceo-engine-box ${isSelected ? 'active' : ''}">
                  <div class="ceb-top">
                    <span class="ceb-tag">${e.tag}</span>
                    <span class="ceb-cost">${formatMoney(e.cost)}/год</span>
                  </div>
                  <div class="ceb-name">${e.name}</div>
                  <div class="ceb-stats">
                    <span>Мощность ERS/ICE: <b>${e.power}/100</b></span> · 
                    <span>Надежность: <b>${e.rel}%</b></span>
                  </div>
                  <button class="btn ${isSelected ? 'ceb-btn-active' : 'ceb-btn-pick'}" onclick="window.selectEngineSupplier('${e.id}')" ${isSelected ? 'disabled' : ''}>
                    ${isSelected ? '✅ ТЕКУЩИЙ КОНТРАКТ' : 'ЗАКЛЮЧИТЬ КОНТРАКТ'}
                  </button>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Section: Title Sponsors -->
        <div class="ceo-sec-block">
          <div class="csb-header">
            <div>
              <span class="f1-mono-sub">COMMERCIAL TITLE PARTNERS</span>
              <h3>💼 ГЕНЕРАЛЬНЫЙ ТИТУЛЬНЫЙ СПОНСОР</h3>
            </div>
          </div>
          <div class="ceo-sponsors-strip">
            ${TITLE_SPONSORS.map(s => {
              const isSelected = (currentSp.id === s.id);
              return `
                <div class="ceo-sponsor-box ${isSelected ? 'active' : ''}">
                  <div class="ceb-top">
                    <span class="ceb-tag">${s.tag}</span>
                    <span class="ceb-cost pay-green">+${formatMoney(s.payout)}/год</span>
                  </div>
                  <div class="ceb-name">${s.name}</div>
                  <div class="ceb-stats">
                    Требование акционеров: <b>Топ-${s.reqPos} в Кубке Конструкторов</b>
                  </div>
                  <button class="btn ${isSelected ? 'ceb-btn-active' : 'ceb-btn-pick'}" onclick="window.selectTitleSponsor('${s.id}')" ${isSelected ? 'disabled' : ''}>
                    ${isSelected ? '✅ ГЕНЕРАЛЬНЫЙ СПОНСОР' : 'ПОДПИСАТЬ СОГЛАШЕНИЕ'}
                  </button>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Section: Factory Facilities Upgrades -->
        <div class="ceo-sec-block">
          <div class="csb-header">
            <div>
              <span class="f1-mono-sub">HQ & R&D INFRASTRUCTURE (COST CAP EXCLUDED)</span>
              <h3>🏗️ МОДЕРНИЗАЦИЯ БАЗЫ И ТЕХНОЛОГИЙ</h3>
            </div>
          </div>
          <div class="ceo-facilities-strip">
            <!-- Facility 1: Wind Tunnel -->
            <div class="ceo-fac-box">
              <div class="cfb-top">
                <span class="cfb-title">АЭРОДИНАМИЧЕСКАЯ ТРУБА 60%</span>
                <span class="cfb-lvl">Tier ${fac.windTunnel}/5</span>
              </div>
              <div class="cfb-pips">${renderPips(fac.windTunnel)}</div>
              <div class="cfb-desc">Высокоточная калибровка прижимной силы и диффузора (+4 к Car Performance).</div>
              <button class="btn cfb-btn ${fac.windTunnel >= 5 ? 'maxed' : ''}" onclick="window.upgradeCeoFacility('windTunnel')" ${fac.windTunnel >= 5 ? 'disabled' : ''}>
                ${fac.windTunnel >= 5 ? 'МАКСИМАЛЬНЫЙ УРОВЕНЬ' : `МОДЕРНИЗИРОВАТЬ (${formatMoney((fac.windTunnel + 1) * 12000000)})`}
              </button>
            </div>

            <!-- Facility 2: CFD Supercomputer -->
            <div class="ceo-fac-box">
              <div class="cfb-top">
                <span class="cfb-title">СУПЕРКОМПЬЮТЕРНЫЙ CFD КЛАСТЕР</span>
                <span class="cfb-lvl">Tier ${fac.cfdSupercomputer}/5</span>
              </div>
              <div class="cfb-pips">${renderPips(fac.cfdSupercomputer)}</div>
              <div class="cfb-desc">Гидродинамическое 3D-моделирование вихрей переднего крыла (+4 к Car Performance).</div>
              <button class="btn cfb-btn ${fac.cfdSupercomputer >= 5 ? 'maxed' : ''}" onclick="window.upgradeCeoFacility('cfdSupercomputer')" ${fac.cfdSupercomputer >= 5 ? 'disabled' : ''}>
                ${fac.cfdSupercomputer >= 5 ? 'МАКСИМАЛЬНЫЙ УРОВЕНЬ' : `МОДЕРНИЗИРОВАТЬ (${formatMoney((fac.cfdSupercomputer + 1) * 12000000)})`}
              </button>
            </div>

            <!-- Facility 3: Composites Autoclaves -->
            <div class="ceo-fac-box">
              <div class="cfb-top">
                <span class="cfb-title">КОМПОЗИТНОЕ ПРОИЗВОДСТВО</span>
                <span class="cfb-lvl">Tier ${fac.compositeFactory}/5</span>
              </div>
              <div class="cfb-pips">${renderPips(fac.compositeFactory)}</div>
              <div class="cfb-desc">Углеволоконные автоклавы: облегчение шасси и снижение сходов (+4% к надежности).</div>
              <button class="btn cfb-btn ${fac.compositeFactory >= 5 ? 'maxed' : ''}" onclick="window.upgradeCeoFacility('compositeFactory')" ${fac.compositeFactory >= 5 ? 'disabled' : ''}>
                ${fac.compositeFactory >= 5 ? 'МАКСИМАЛЬНЫЙ УРОВЕНЬ' : `МОДЕРНИЗИРОВАТЬ (${formatMoney((fac.compositeFactory + 1) * 12000000)})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderBoardTab(container) {
    const history = CEO_STATE.history || [];

    container.innerHTML = `
      <div class="ceo-board-content">
        <div class="ceo-board-hero">
          <div class="cbh-left">
            <span class="f1-mono-sub">BOARD OF DIRECTORS CONFIDENCE</span>
            <div class="cbh-title">🏛️ ДОВЕРИЕ СОВЕТА АКЦИОНЕРОВ: <b>${CEO_STATE.boardApproval}%</b></div>
            <div class="cbh-desc">
              Как управляющий совладелец, вы несете персональную ответственность перед советом директоров. 
              ${CEO_STATE.boardApproval >= 70 ? 
                '✅ Акционеры довольны текущим курсом развития и одобряют выбранную стратегию.' : 
                '⚠️ Внимание: Низкий уровень доверия акционеров! Совет настаивает на кадровых перестановках в техническом штабе.'}
            </div>
          </div>
          <div class="cbh-gauge-wrap">
            <div class="cbh-gauge-bar">
              <div class="cbh-gauge-fill" style="width: ${CEO_STATE.boardApproval}%; background: ${CEO_STATE.boardApproval >= 70 ? '#10b981' : CEO_STATE.boardApproval >= 45 ? '#f59e0b' : '#ef4444'};"></div>
            </div>
          </div>
        </div>

        <div class="ceo-history-block">
          <div class="chb-title">🏆 ХРОНИКА ВЫСТУПЛЕНИЙ В КУБКЕ КОНСТРУКТОРОВ</div>
          ${history.length === 0 ? `
            <div class="ceo-empty-history">
              🏎️ Команда находится в межсезонье и готовится к дебютному чемпионату. Нажмите «СИМУЛИРОВАТЬ СЕЗОН» внизу!
            </div>
          ` : `
            <div class="ceo-history-table">
              <div class="cht-head">
                <span>СЕЗОН</span>
                <span>ПОЗИЦИЯ КК</span>
                <span>ОЧКИ</span>
                <span>ПОБЕДЫ</span>
                <span>ПОДИУМЫ</span>
                <span>ФИНАНСОВЫЙ РЕЗУЛЬТАТ</span>
              </div>
              ${history.map(h => `
                <div class="cht-row ${h.wccPos === 1 ? 'gold-row' : ''}">
                  <span class="cht-season">Сезон ${h.seasonNum} (${h.year})</span>
                  <span class="cht-pos"><b>P${h.wccPos}</b> ${h.wccPos === 1 ? '🏆' : ''}</span>
                  <span class="cht-pts">${h.wccPoints}</span>
                  <span class="cht-wins">${h.wins}</span>
                  <span class="cht-pods">${h.podiums}</span>
                  <span class="cht-profit ${h.profit >= 0 ? 'cfb-green' : 'cfb-red'}">
                    ${h.profit >= 0 ? '+' : ''}${formatMoney(h.profit)}
                  </span>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      </div>
    `;
  }

  window.selectEngineSupplier = function(id) {
    if(!CEO_STATE) loadCeoState();
    const eng = ENGINE_SUPPLIERS.find(e => e.id === id);
    if(eng) {
      CEO_STATE.engine = Object.assign({}, eng);
      saveCeoState();
      renderCeoModal();
      if(window.showF1Toast) window.showF1Toast(`🔧 Контракт с поставщиком моторов ${eng.name} утвержден!`, "success");
    }
  };

  window.selectTitleSponsor = function(id) {
    if(!CEO_STATE) loadCeoState();
    const sp = TITLE_SPONSORS.find(s => s.id === id);
    if(sp) {
      CEO_STATE.sponsor = Object.assign({}, sp);
      saveCeoState();
      renderCeoModal();
      if(window.showF1Toast) window.showF1Toast(`💼 Спонсорское соглашение с ${sp.name} подписано!`, "success");
    }
  };

  // Switch tabs
  window.switchCeoTab = function(tab) {
    activeCeoTab = tab;
    renderCeoModal();
  };

  window.openCeoModal = function() {
    loadCeoState();
    renderCeoModal();
    const m = document.getElementById("ceoModal");
    if(m) m.style.display = "flex";
  };

  window.closeCeoModal = function() {
    const m = document.getElementById("ceoModal");
    if(m) {
      m.style.display = "none";
      const body = document.getElementById("ceoTabContent");
      if(body) body.textContent = ""; // Release active tab DOM nodes to garbage collector
    }
  };

  window.fireCeoTechDirector = function() {
    fireTechDirector();
  };

  window.fireCeoTeamPrincipal = function() {
    fireTeamPrincipal();
  };

  window.openCeoDriverMarket = function(seatIndex) {
    openDriverMarketModal(seatIndex);
  };

  window.upgradeCeoFacility = function(key) {
    upgradeFacility(key);
  };

  window.runCeoSeasonSimulation = function() {
    simulateCeoSeason();
  };

  window.updateTcName = function(val) {
    tempTeamData.name = val;
    const tcp = document.querySelector(".tc-preview-card .tcp-name");
    if(tcp) tcp.textContent = val || 'Shelby F1 Team';
  };

  window.applyTcPreset = function(preset) {
    tempTeamData.name = preset;
    const input = document.getElementById("tcInputName");
    if(input) input.value = preset;
    const tcp = document.querySelector(".tc-preview-card .tcp-name");
    if(tcp) tcp.textContent = preset;
  };

  window.setTcHq = function(id) {
    tempTeamData.hqId = id;
    renderTeamCreationModal(window._tcIsEditing || false);
  };

  window.setTcLivery = function(id) {
    tempTeamData.liveryId = id;
    renderTeamCreationModal(window._tcIsEditing || false);
  };

  window.setTcStory = function(id) {
    tempTeamData.storyId = id;
    renderTeamCreationModal(window._tcIsEditing || false);
  };

  window.openTeamCreationModal = function(isEditing) {
    window._tcIsEditing = !!isEditing;
    openTeamCreationModal(!!isEditing);
  };

  window.confirmTeamCreation = function(isEditing) {
    const hq = HQ_LOCATIONS.find(h => h.id === tempTeamData.hqId) || HQ_LOCATIONS[0];
    const livery = LIVERY_PALETTES.find(l => l.id === tempTeamData.liveryId) || LIVERY_PALETTES[0];
    const story = ORIGIN_STORIES.find(s => s.id === tempTeamData.storyId) || ORIGIN_STORIES[0];

    CEO_STATE.teamName = (tempTeamData.name || getDefaultTeamName()).trim();
    CEO_STATE.teamHq = `${hq.name} (${hq.country})`;
    CEO_STATE.teamFlag = hq.flag;
    CEO_STATE.teamColor = livery.primary;
    CEO_STATE.teamLivery = livery.id;
    CEO_STATE.teamStory = story.title;

    saveCeoState();
    window.closeTeamCreationModal();
    openCeoModal();
    if(window.showF1Toast) {
      window.showF1Toast(`🏛️ Конюшня «${CEO_STATE.teamName}» официально зарегистрирована в FIA!`, "success");
    }
  };

  // Wire up retirement / career end transition to CEO
  window.launchCeoFromRetirement = function() {
    if(typeof S !== "undefined" && S) {
      S.assets = S.assets || [];
      if(!S.assets.includes("f1_team_share")) S.assets.push("f1_team_share");
    }
    const endM = document.getElementById("endModal");
    if(endM) endM.style.display = "none";
    initCeoState();
    openTeamCreationModal(false);
  };

  // Global keydown listener for Escape key to close open CEO modals cleanly and free memory
  window.addEventListener("keydown", function(e) {
    if(e.key === "Escape") {
      const staffM = document.getElementById("ceoStaffMarketModal");
      if(staffM && staffM.style.display === "flex") { window.closeCeoStaffMarketModal(); return; }
      const drvM = document.getElementById("ceoDriverMarketModal");
      if(drvM && drvM.style.display === "flex") { window.closeCeoDriverMarketModal(); return; }
      const debM = document.getElementById("ceoDebriefModal");
      if(debM && debM.style.display === "flex") { window.closeCeoDebriefModal(); return; }
      const tcM = document.getElementById("teamCreationModal");
      if(tcM && tcM.style.display === "flex") { window.closeTeamCreationModal(); return; }
      const ceoM = document.getElementById("ceoModal");
      if(ceoM && ceoM.style.display === "flex") { window.closeCeoModal(); return; }
    }
  });

  // Global reset for career start / state clear
  window.resetCeoMode = function() {
    window.closeCeoStaffMarketModal();
    window.closeCeoDriverMarketModal();
    window.closeCeoDebriefModal();
    window.closeTeamCreationModal();
    window.closeCeoModal();
    CEO_STATE = null;
    try {
      localStorage.removeItem("f1g_ceo_state");
    } catch(e) {}
  };

  // Expose global init
  window.initCeoMode = function() {
    loadCeoState();
  };

  document.addEventListener("DOMContentLoaded", function(){
    loadCeoState();
  });
})();
