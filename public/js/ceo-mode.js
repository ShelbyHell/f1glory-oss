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

  let CEO_STATE = null;

  function initCeoState() {
    let teamName = "Shelby F1 Team";
    if(typeof S !== "undefined" && S && S.team && S.team.name) {
      teamName = S.team.name + " Racing";
    }

    CEO_STATE = {
      teamName: teamName,
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

  function openStaffMarketModal(type, firedName) {
    let m = document.getElementById("ceoStaffMarketModal");
    if(!m) {
      m = document.createElement("div");
      m.id = "ceoStaffMarketModal";
      m.className = "f1-modal-overlay";
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
          <button class="rank-x" onclick="document.getElementById('ceoStaffMarketModal').style.display='none'">✕</button>
        </div>

        <div class="ceo-market-banner">
          <div class="cmb-alert">
            🚨 <b>Решение Совета Директоров:</b> Предыдущий специалист (<b>${firedName}</b>) отправлен в отставку.
            Выберите нового главу подразделения для утверждения акционерами.
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
    const m = document.getElementById("ceoStaffMarketModal");
    if(m) m.style.display = "none";
    renderCeoModal();
  };

  function openDriverMarketModal(seatIndex) {
    let m = document.getElementById("ceoDriverMarketModal");
    if(!m) {
      m = document.createElement("div");
      m.id = "ceoDriverMarketModal";
      m.className = "f1-modal-overlay";
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
          <button class="rank-x" onclick="document.getElementById('ceoDriverMarketModal').style.display='none'">✕</button>
        </div>

        <div class="ceo-market-banner">
          <div class="cmb-alert">
            Текущий пилот: <b>${currentDriver.name}</b> (OVR: ${currentDriver.ovr}, ${currentDriver.isPay ? `Рента-спонсоры: +${formatMoney(Math.abs(currentDriver.salary))}` : `Оклад: ${formatMoney(currentDriver.salary)}`}).
            Выберите гонщика для подписания в основной состав.
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
    const m = document.getElementById("ceoDriverMarketModal");
    if(m) m.style.display = "none";
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
    CEO_STATE.lastSeasonSummary = summary;
    CEO_STATE.seasonNum += 1;
    CEO_STATE.year += 1;

    saveCeoState();
    renderCeoModal();
    openSeasonDebriefModal(summary);
  }

  function openSeasonDebriefModal(summary) {
    let m = document.getElementById("ceoDebriefModal");
    if(!m) {
      m = document.createElement("div");
      m.id = "ceoDebriefModal";
      m.className = "f1-modal-overlay";
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
          <button class="rank-x" onclick="document.getElementById('ceoDebriefModal').style.display='none'">✕</button>
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
            <button class="btn s-btn ceo-fire-btn" onclick="document.getElementById('ceoDebriefModal').style.display='none'; window.fireCeoTechDirector();">
              ⚠️ УВОЛИТЬ ГЛАВНОГО ИНЖЕНЕРА (СОВЕТ НАСТАИВАЕТ)
            </button>
          ` : ''}
          <button class="btn s-btn sc-buy" onclick="document.getElementById('ceoDebriefModal').style.display='none'">
            ПРОДОЛЖИТЬ В КАБИНЕТ CEO
          </button>
        </div>
      </div>
    `;

    m.style.display = "flex";
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
            <h2 id="ceoTeamTitle">🏛️ <span id="ceoTeamNameVal">Shelby F1 Team</span></h2>
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

    document.getElementById("ceoTeamNameVal").textContent = CEO_STATE.teamName;
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
      <div class="ceo-overview-grid">
        <!-- Car Performance Summary -->
        <div class="ceo-card car-perf-card">
          <div class="cc-title">🏎️ ИНДЕКС БОЛИДА F1 (ТЕМП И НАДЕЖНОСТЬ)</div>
          <div class="car-meters">
            <div class="cm-row">
              <span>Скорость и прижимная сила:</span>
              <div class="cm-bar-wrap"><div class="cm-bar" style="width: ${CEO_STATE.carPerf}%; background: #00d2be;"></div></div>
              <b>${CEO_STATE.carPerf}/100</b>
            </div>
            <div class="cm-row">
              <span>Механическая надежность:</span>
              <div class="cm-bar-wrap"><div class="cm-bar" style="width: ${CEO_STATE.carRel}%; background: #10b981;"></div></div>
              <b>${CEO_STATE.carRel}%</b>
            </div>
          </div>
        </div>

        <!-- Chief Technical Officer (CTO) Card -->
        <div class="ceo-card staff-card ${td.skill >= 90 ? 'elite' : ''}">
          <div class="cc-badge-row">
            <span class="sc-tag">ГЛАВНЫЙ ИНЖЕНЕР (CTO)</span>
            <span class="sc-price">${formatMoney(td.salary)}/год</span>
          </div>
          <div class="sc-name">${td.name}</div>
          <div class="sc-specs">
            <div>Рейтинг мастерства: <b>${td.skill}/100</b></div>
            <div>Специфика: <b>${td.trait}</b></div>
          </div>
          <div class="ceo-action-row">
            <button class="btn s-btn ceo-fire-btn" onclick="window.fireCeoTechDirector()">
              ⚠️ УВОЛИТЬ ГЛАВНОГО ИНЖЕНЕРА
            </button>
          </div>
        </div>

        <!-- Team Principal Card -->
        <div class="ceo-card staff-card">
          <div class="cc-badge-row">
            <span class="sc-tag">РУКОВОДИТЕЛЬ КОМАНДЫ (TP)</span>
            <span class="sc-price">${formatMoney(tp.salary)}/год</span>
          </div>
          <div class="sc-name">${tp.name}</div>
          <div class="sc-specs">
            <div>Авторитет на мостике: <b>${tp.skill}/100</b></div>
            <div>Профиль: <b>${tp.trait}</b></div>
          </div>
          <div class="ceo-action-row">
            <button class="btn s-btn sc-buy" onclick="window.fireCeoTeamPrincipal()">
              Сменить Team Principal
            </button>
          </div>
        </div>

        <!-- Driver 1 -->
        <div class="ceo-card driver-card">
          <div class="cc-badge-row">
            <span class="sc-tag">ПИЛОТ №1 (ЛИДЕР)</span>
            <span class="sc-price">${formatMoney(d1.salary)}/год</span>
          </div>
          <div class="sc-name">${d1.name}</div>
          <div class="sc-specs">
            <div>Рейтинг пилотажа: <b>${d1.ovr} OVR</b></div>
            <div>Статус: <b>${d1.tag}</b></div>
          </div>
          <div class="ceo-action-row">
            <button class="btn s-btn sc-buy" onclick="window.openCeoDriverMarket(1)">
              Сменить пилота №1
            </button>
          </div>
        </div>

        <!-- Driver 2 -->
        <div class="ceo-card driver-card ${d2.isPay ? 'pay-border' : ''}">
          <div class="cc-badge-row">
            <span class="sc-tag ${d2.isPay ? 'asset-tag' : ''}">ПИЛОТ №2 ${d2.isPay ? '(PAY DRIVER)' : ''}</span>
            <span class="sc-price ${d2.isPay ? 'asset-price' : ''}">${d2.isPay ? `+${formatMoney(Math.abs(d2.salary))}/год` : `${formatMoney(d2.salary)}/год`}</span>
          </div>
          <div class="sc-name">${d2.name}</div>
          <div class="sc-specs">
            <div>Рейтинг пилотажа: <b>${d2.ovr} OVR</b></div>
            <div>Статус: <b>${d2.tag}</b></div>
          </div>
          <div class="ceo-action-row">
            <button class="btn s-btn ${d2.isPay ? 'asset-buy' : 'sc-buy'}" onclick="window.openCeoDriverMarket(2)">
              Сменить пилота №2
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderFactoryTab(container) {
    const eng = CEO_STATE.engine;
    const sp = CEO_STATE.sponsor;
    const fac = CEO_STATE.facilities;

    container.innerHTML = `
      <div class="ceo-factory-grid">
        <!-- Engine Supplier -->
        <div class="ceo-card">
          <div class="cc-badge-row">
            <span class="sc-tag asset-tag">СИЛОВАЯ УСТАНОВКА F1</span>
            <span class="sc-price">${formatMoney(eng.cost)} / сезон</span>
          </div>
          <div class="sc-name">${eng.name}</div>
          <div class="sc-specs">
            <div>Мощность ERS/ICE: <b>${eng.power}/100</b> · Надежность: <b>${eng.rel}%</b></div>
            <div>Характеристика: <b>${eng.tag}</b></div>
          </div>
          <div class="ceo-engine-selector">
            <select class="f1-select" onchange="window.selectEngineSupplier(this.value)">
              ${ENGINE_SUPPLIERS.map(e => `
                <option value="${e.id}" ${e.id === eng.id ? 'selected' : ''}>
                  ${e.name} (${formatMoney(e.cost)}, Мощность ${e.power})
                </option>
              `).join("")}
            </select>
          </div>
        </div>

        <!-- Title Sponsor -->
        <div class="ceo-card">
          <div class="cc-badge-row">
            <span class="sc-tag asset-tag">ТИТУЛЬНЫЙ СПОНСОР</span>
            <div class="cfb-val cfb-green">+${formatMoney(sp.payout)} / сезон</div>
          </div>
          <div class="sc-name">${sp.name}</div>
          <div class="sc-specs">
            <div>Индустрия: <b>${sp.tag}</b></div>
            <div>Требование акционеров: <b>Топ-${sp.reqPos} в Кубке Конструкторов</b></div>
          </div>
          <div class="ceo-engine-selector">
            <select class="f1-select" onchange="window.selectTitleSponsor(this.value)">
              ${TITLE_SPONSORS.map(s => `
                <option value="${s.id}" ${s.id === sp.id ? 'selected' : ''}>
                  ${s.name} (+${formatMoney(s.payout)})
                </option>
              `).join("")}
            </select>
          </div>
        </div>

        <!-- Facility Upgrades -->
        <div class="ceo-card fac-card">
          <div class="cc-badge-row">
            <span class="sc-tag">АЭРОДИНАМИЧЕСКАЯ ТРУБА 60%</span>
            <span class="sc-price">Tier ${fac.windTunnel}/5</span>
          </div>
          <div class="sc-specs">Ключевой инструмент проектирования прижимной силы болида (+4 к Car Perf).</div>
          <button class="btn s-btn ${fac.windTunnel >= 5 ? 'sc-locked' : 'sc-buy'}" onclick="window.upgradeCeoFacility('windTunnel')">
            ${fac.windTunnel >= 5 ? 'Максимальный уровень' : `Модернизировать (${formatMoney((fac.windTunnel + 1) * 12000000)})`}
          </button>
        </div>

        <div class="ceo-card fac-card">
          <div class="cc-badge-row">
            <span class="sc-tag">СУПЕРКОМПЬЮТЕРНЫЙ CFD КЛАСТЕР</span>
            <span class="sc-price">Tier ${fac.cfdSupercomputer}/5</span>
          </div>
          <div class="sc-specs">Вычислительная гидродинамика для виртуального моделирования потоков (+4 к Car Perf).</div>
          <button class="btn s-btn ${fac.cfdSupercomputer >= 5 ? 'sc-locked' : 'sc-buy'}" onclick="window.upgradeCeoFacility('cfdSupercomputer')">
            ${fac.cfdSupercomputer >= 5 ? 'Максимальный уровень' : `Модернизировать (${formatMoney((fac.cfdSupercomputer + 1) * 12000000)})`}
          </button>
        </div>

        <div class="ceo-card fac-card">
          <div class="cc-badge-row">
            <span class="sc-tag">КОМПОЗИТНОЕ ПРОИЗВОДСТВО</span>
            <span class="sc-price">Tier ${fac.compositeFactory}/5</span>
          </div>
          <div class="sc-specs">Автоклавы и цеха карбоновых волокон, снижающие вес и сходы (+4% к надежности).</div>
          <button class="btn s-btn ${fac.compositeFactory >= 5 ? 'sc-locked' : 'sc-buy'}" onclick="window.upgradeCeoFacility('compositeFactory')">
            ${fac.compositeFactory >= 5 ? 'Максимальный уровень' : `Модернизировать (${formatMoney((fac.compositeFactory + 1) * 12000000)})`}
          </button>
        </div>
      </div>
    `;
  }

  function renderBoardTab(container) {
    const history = CEO_STATE.history || [];

    container.innerHTML = `
      <div class="ceo-board-content">
        <div class="ceo-board-banner">
          <div class="cbb-title">🏛️ СОВЕТ ДИРЕКТОРОВ И АКЦИОНЕРЫ КОМАНДЫ</div>
          <div class="cbb-desc">
            Как владелец и управляющий (CEO), вы определяете вектор развития завода и несете прямую ответственность перед инвестиционным комитетом.
            Победы в Кубке Конструкторов увеличивают рыночную оценку конюшни, а падение на дно пелотона приводит к ультиматумам и перестановкам в менеджменте.
          </div>
        </div>

        <div class="ceo-history-list">
          <h3>ХРОНИКА СЕЗОНОВ ПОД ВАШИМ РУКОВОДСТВОМ</h3>
          ${history.length === 0 ? `
            <div class="ceo-empty-history">
              Команда готовится к первому сезону чемпионата. Проведите симуляцию 24 Гран-при!
            </div>
          ` : history.map(h => `
            <div class="ceo-history-row ${h.wccPos === 1 ? 'gold-row' : ''}">
              <div class="chr-season">Сезон ${h.seasonNum} (${h.year})</div>
              <div class="chr-pos"><b>P${h.wccPos}</b> в Кубке Конструкторов</div>
              <div class="chr-stats">${h.wccPoints} очков · 🏆 ×${h.wins} · 🍾 ×${h.podiums}</div>
              <div class="chr-profit ${h.profit >= 0 ? 'cfb-green' : 'cfb-red'}">${h.profit >= 0 ? '+' : ''}${formatMoney(h.profit)}</div>
            </div>
          `).join("")}
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
    if(m) m.style.display = "none";
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

  // Wire up retirement / career end transition to CEO
  window.launchCeoFromRetirement = function() {
    if(typeof S !== "undefined" && S) {
      S.assets = S.assets || [];
      if(!S.assets.includes("f1_team_share")) S.assets.push("f1_team_share");
    }
    const endM = document.getElementById("endModal");
    if(endM) endM.style.display = "none";
    initCeoState();
    if(typeof S !== "undefined" && S && S.team && S.team.name) {
      CEO_STATE.teamName = S.team.name + " Racing";
      saveCeoState();
    }
    openCeoModal();
    if(window.showF1Toast) window.showF1Toast("🏛️ Поздравляем! Вы официально вступили в должность CEO и владельца команды Формулы-1!", "success");
  };

  // Expose global init
  window.initCeoMode = function() {
    loadCeoState();
  };

  document.addEventListener("DOMContentLoaded", function(){
    loadCeoState();
  });
})();
