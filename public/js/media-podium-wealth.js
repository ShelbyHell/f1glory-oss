/* =====================================================================
   F1 Glory · Paddock Press, Podium Celebration & Driver Wealth / Garage
   Модуль прессы паддока, подиумного празднования и банковского счёта с гаражом
   ===================================================================== */

(function(){
  // =====================================================================
  // 1. DRIVER WEALTH, SUPERCARS GARAGE & BUSINESS ASSETS
  // =====================================================================
  const SUPERCARS_CATALOG = [
    { id: "porsche_gt3", name: "Porsche 911 GT3 RS", price: 350000, power: "525 л.с.", speed: "296 км/ч", ico: "🏎️", tag: "Трековый скальпель" },
    { id: "ferrari_f40", name: "Ferrari F40", price: 2500000, power: "478 л.с.", speed: "324 км/ч", ico: "🔴", tag: "Икона 90-х" },
    { id: "amg_one", name: "Mercedes-AMG ONE (F1 V6)", price: 3000000, power: "1063 л.с.", speed: "352 км/ч", ico: "⚡", tag: "Мотор от болида Хэмилтона" },
    { id: "valkyrie", name: "Aston Martin Valkyrie", price: 3500000, power: "1160 л.с.", speed: "355 км/ч", ico: "🟢", tag: "Шедевр Эдриана Ньюи" },
    { id: "laferrari", name: "Ferrari LaFerrari", price: 4200000, power: "963 л.с.", speed: "350 км/ч", ico: "🏎️", tag: "Гибридный флагман Маранелло" },
    { id: "chiron", name: "Bugatti Chiron Super Sport", price: 5000000, power: "1600 л.с.", speed: "440 км/ч", ico: "🚀", tag: "Король максимальной скорости" },
    { id: "mclaren_f1", name: "McLaren F1 (1995)", price: 18000000, power: "627 л.с.", speed: "386 км/ч", ico: "🏆", tag: "Величайший суперкар в истории" }
  ];

  const BUSINESS_ASSETS_CATALOG = [
    { id: "karting_academy", name: "Картинговая академия юниоров", price: 1500000, type: "Автоспортивное образование", benefit: "Поиск и воспитание юных талантов для F3/F2", ico: "🏁🎓", tag: "Юниорская база" },
    { id: "sim_center", name: "Киберспортивный симрейсинг-комплекс", price: 4000000, type: "Инжиниринг и симуляторы", benefit: "Точные виртуальные тесты и телеметрия", ico: "🎮⚡", tag: "Симрейсинг хаб" },
    { id: "private_jet", name: "Бизнес-джет Gulfstream G650ER", price: 22000000, type: "Паддок-авиация и логистика", benefit: "Беспосадочные перелеты между 24 этапами", ico: "✈️🌐", tag: "VIP мобильность" },
    { id: "wind_tunnel_share", name: "Доля в аэродинамическом комплексе", price: 45000000, type: "Высокие технологии и CFD", benefit: "Доступ к 60% аэродинамической трубе F1", ico: "🔬🌀", tag: "R&D Инфраструктура" },
    { id: "f1_team_share", name: "Контрольный пакет команды F1", price: 85000000, type: "Конструктор Формулы-1", benefit: "Статус совладельца и решающий голос в Комиссии F1", ico: "🏛️🏎️", tag: "Владелец конюшни" }
  ];

  let currentWealthTab = "supercars";

  function getDriverWealth() {
    if(typeof S === "undefined" || !S) return 0;
    if(typeof S.bankAccount !== "number") {
      // Calculate retrospective wealth based on career
      let base = 2500000;
      (S.seasons || []).forEach(s => {
        if(s.cat === "F1") {
          const perf = (s.team && s.team.perf) || 80;
          base += Math.round(perf * 150000);
          base += (s.wins || 0) * 1200000;
          base += (s.pods || 0) * 500000;
          if(s.pos === 1) base += 12000000;
        } else {
          base += 150000;
        }
      });
      S.bankAccount = base;
      S.garage = S.garage || [];
      S.assets = S.assets || [];
    }

    // Auto-migrate f1_team_share out of car garage if it was previously bought there
    if(S.garage && S.garage.includes("f1_team_share")) {
      S.garage = S.garage.filter(id => id !== "f1_team_share");
      S.assets = S.assets || [];
      if(!S.assets.includes("f1_team_share")) {
        S.assets.push("f1_team_share");
      }
    }
    if(!S.garage) S.garage = [];
    if(!S.assets) S.assets = [];
    return S.bankAccount;
  }

  function addSeasonEarnings(row) {
    if(typeof S === "undefined" || !S) return;
    getDriverWealth();
    let earn = 0;
    if(S.cat === "F1") {
      const myTeamName = (S.team && S.team.name) || "";
      const perf = (S.f1perf && S.f1perf[myTeamName]) || 80;
      // Base salary scales with team performance & OVR
      earn += Math.round(perf * 180000 * ((S.ovr || 50) / 75));
      earn += (row.wins || 0) * 1500000;
      earn += (row.pods || 0) * 600000;
      if(row.pos === 1) earn += 15000000; // Championship bonus
    } else if(S.cat === "TP") {
      earn += 8000000 + ((S.titles && S.titles.constr) ? 10000000 : 0);
    } else {
      earn += 350000;
    }
    S.bankAccount = (S.bankAccount || 0) + earn;
    row.seasonEarnings = earn;
    updateWealthUI();
  }

  function formatMoney(num) {
    if(num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if(num >= 1000) return `$${Math.round(num / 1000)}K`;
    return `$${num}`;
  }

  function buySupercar(carId) {
    getDriverWealth();
    const car = SUPERCARS_CATALOG.find(c => c.id === carId);
    if(!car) return;
    if((S.bankAccount || 0) < car.price) {
      if(window.showF1Toast) window.showF1Toast("Недостаточно средств на банковском счёте!", "error");
      return;
    }
    S.garage = S.garage || [];
    if(S.garage.includes(carId)) {
      if(window.showF1Toast) window.showF1Toast("Этот суперкар уже есть в вашей коллекции!", "error");
      return;
    }
    S.bankAccount -= car.price;
    S.garage.push(carId);
    renderWealthModal();
    updateWealthUI();
    if(window.showF1Toast) window.showF1Toast(`🏎️ Приобретён ${car.name}! Машина доставлена в ваш гараж!`, "success");
  }

  function buyAsset(assetId) {
    getDriverWealth();
    const asset = BUSINESS_ASSETS_CATALOG.find(a => a.id === assetId);
    if(!asset) return;
    if((S.bankAccount || 0) < asset.price) {
      if(window.showF1Toast) window.showF1Toast("Недостаточно средств на инвестиционном счёте!", "error");
      return;
    }
    S.assets = S.assets || [];
    if(S.assets.includes(assetId)) {
      if(window.showF1Toast) window.showF1Toast("Этот бизнес-актив уже приобретён вами!", "error");
      return;
    }
    S.bankAccount -= asset.price;
    S.assets.push(assetId);
    renderWealthModal();
    updateWealthUI();
    if(window.showF1Toast) window.showF1Toast(`💼 Сделка закрыта: ${asset.name}! Активы перешли под ваш контроль!`, "success");
  }

  function updateWealthUI() {
    const wealth = getDriverWealth();
    let hudWealth = document.getElementById("hudWealthChip");
    if(!hudWealth) {
      const hudRight = document.querySelector(".career-hud .hud-right");
      if(hudRight) {
        hudWealth = document.createElement("button");
        hudWealth.id = "hudWealthChip";
        hudWealth.className = "hud-wealth-chip";
        hudWealth.title = "Банковский счёт, автопарк и активы";
        hudWealth.onclick = () => openWealthModal();
        hudRight.insertBefore(hudWealth, hudRight.firstChild);
      }
    }
    if(hudWealth) {
      hudWealth.innerHTML = `💰 <b>${formatMoney(wealth)}</b>`;
    }
  }

  // Wealth Modal
  function createWealthModalDOM() {
    if(document.getElementById("wealthModal")) return;
    const m = document.createElement("div");
    m.id = "wealthModal";
    m.className = "f1-modal-overlay";
    m.innerHTML = `
      <div class="f1-modal-card wealth-card">
        <div class="wealth-head">
          <div>
            <span class="f1-mono-sub">PRIVATE BANKING · VEHICLE FLEET & ENTERPRISE ASSETS</span>
            <h2>💰 <span>Капитал, Автопарк и Бизнес-активы</span></h2>
          </div>
          <button class="rank-x" onclick="closeWealthModal()">✕</button>
        </div>

        <div class="wealth-summary-banner">
          <div class="wealth-balance-box">
            <span class="wb-lbl">ТЕКУЩИЙ БАЛАНС СЧЁТА</span>
            <div class="wb-val" id="wealthTotalVal">$0</div>
          </div>
          <div class="wealth-garage-count">
            <span class="wb-lbl">СУПЕРКАРЫ В ГАРАЖЕ</span>
            <div class="wb-val" id="wealthGarageCount">0 из 7</div>
          </div>
          <div class="wealth-assets-count">
            <span class="wb-lbl">БИЗНЕС-АКТИВЫ</span>
            <div class="wb-val" id="wealthAssetsCount">0 из 5</div>
          </div>
        </div>

        <div class="wealth-nav-tabs">
          <button class="wealth-tab-btn active" id="tabBtnSupercars" onclick="switchWealthTab('supercars')">🏎️ Автопарк суперкаров</button>
          <button class="wealth-tab-btn" id="tabBtnAssets" onclick="switchWealthTab('assets')">🏢 Бизнес-активы и Инвестиции</button>
        </div>

        <div class="wealth-tab-content">
          <div class="supercars-grid" id="wealthItemsGrid"></div>
        </div>
      </div>
    `;
    document.body.appendChild(m);
    m.addEventListener("click", e => { if(e.target === m) closeWealthModal(); });
  }

  function renderWealthModal() {
    createWealthModalDOM();
    const wealth = getDriverWealth();
    const garage = S.garage || [];
    const assets = S.assets || [];

    document.getElementById("wealthTotalVal").textContent = formatMoney(wealth);
    document.getElementById("wealthGarageCount").textContent = `${garage.length} из ${SUPERCARS_CATALOG.length}`;
    document.getElementById("wealthAssetsCount").textContent = `${assets.length} из ${BUSINESS_ASSETS_CATALOG.length}`;

    const btnSupercars = document.getElementById("tabBtnSupercars");
    const btnAssets = document.getElementById("tabBtnAssets");
    if(btnSupercars && btnAssets) {
      if(currentWealthTab === "supercars") {
        btnSupercars.classList.add("active");
        btnAssets.classList.remove("active");
      } else {
        btnSupercars.classList.remove("active");
        btnAssets.classList.add("active");
      }
    }

    const grid = document.getElementById("wealthItemsGrid");
    if(!grid) return;

    if(currentWealthTab === "supercars") {
      grid.innerHTML = SUPERCARS_CATALOG.map(c => {
        const isOwned = garage.includes(c.id);
        const canAfford = wealth >= c.price;

        return `
          <div class="supercar-card ${isOwned ? 'owned' : ''}">
            <div class="sc-top">
              <span class="sc-ico">${c.ico}</span>
              <span class="sc-tag">${c.tag}</span>
              <span class="sc-price">${formatMoney(c.price)}</span>
            </div>
            <div class="sc-name">${c.name}</div>
            <div class="sc-specs">
              <span>Мощность: <b>${c.power}</b></span> · 
              <span>Макс. скорость: <b>${c.speed}</b></span>
            </div>
            <div class="sc-actions">
              ${isOwned ? `
                <div class="sc-owned-badge">✅ В ВАШЕМ ГАРАЖЕ</div>
              ` : `
                <button class="btn s-btn ${canAfford ? 'sc-buy' : 'sc-locked'}" onclick="buyF1Supercar('${c.id}')" ${!canAfford ? 'disabled' : ''}>
                  ${canAfford ? 'Купить в гараж' : 'Недостаточно $'}
                </button>
              `}
            </div>
          </div>
        `;
      }).join("");
    } else {
      // Business Assets tab
      grid.innerHTML = BUSINESS_ASSETS_CATALOG.map(a => {
        const isOwned = assets.includes(a.id);
        const canAfford = wealth >= a.price;

        return `
          <div class="supercar-card asset-card ${isOwned ? 'owned' : ''}">
            <div class="sc-top">
              <span class="sc-ico">${a.ico}</span>
              <span class="sc-tag asset-tag">${a.tag}</span>
              <span class="sc-price asset-price">${formatMoney(a.price)}</span>
            </div>
            <div class="sc-name">${a.name}</div>
            <div class="sc-specs">
              <div style="margin-bottom: 3px;">Сфера: <b>${a.type}</b></div>
              <div>Эффект: <b>${a.benefit}</b></div>
            </div>
            <div class="sc-actions">
              ${isOwned ? `
                <div class="asset-owned-badge">✅ В ВАШЕМ ВЛАДЕНИИ</div>
                ${a.id === 'f1_team_share' ? `
                  <button class="btn s-btn asset-buy" style="margin-top:6px; font-size:11.5px; padding:8px 10px;" onclick="closeWealthModal(); window.openCeoModal();">
                    🏛️ ВОЙТИ В КАБИНЕТ CEO
                  </button>
                ` : ''}
              ` : `
                <button class="btn s-btn ${canAfford ? 'asset-buy' : 'sc-locked'}" onclick="buyF1Asset('${a.id}')" ${!canAfford ? 'disabled' : ''}>
                  ${canAfford ? 'Инвестировать капитал' : 'Недостаточно $'}
                </button>
              `}
            </div>
          </div>
        `;
      }).join("");
    }
  }

  window.openWealthModal = function(tab) {
    if(tab) currentWealthTab = tab;
    renderWealthModal();
    const m = document.getElementById("wealthModal");
    if(m) m.style.display = "flex";
  };
  window.closeWealthModal = function() {
    const m = document.getElementById("wealthModal");
    if(m) m.style.display = "none";
  };
  window.buyF1Supercar = function(id) {
    buySupercar(id);
  };
  window.buyF1Asset = function(id) {
    buyAsset(id);
  };
  window.switchWealthTab = function(tab) {
    currentWealthTab = tab;
    renderWealthModal();
  };

  // =====================================================================
  // 2. CONFETTI & PODIUM CELEBRATION ANIMATION
  // =====================================================================
  let confettiAnimationId = null;
  let particles = [];

  function createPodiumModalDOM() {
    if(document.getElementById("podiumModal")) return;
    const m = document.createElement("div");
    m.id = "podiumModal";
    m.className = "podium-modal";
    m.innerHTML = `
      <canvas id="confettiCanvas"></canvas>
      <div class="podium-content">
        <div class="podium-trophy" id="podiumTrophyIco">🏆</div>
        <div class="podium-title" id="podiumTitle">ПОБЕДА В ГРАН-ПРИ!</div>
        <div class="podium-sub" id="podiumSub">Блестящий финиш на вершине подиума</div>
        <div class="podium-champ-cup" id="podiumChampCup"></div>
        <button class="btn podium-btn" onclick="closePodiumModal()">🍾 ПРОДОЛЖИТЬ СЕЗОН</button>
      </div>
    `;
    document.body.appendChild(m);
  }

  function launchConfetti() {
    const canvas = document.getElementById("confettiCanvas");
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particles = [];
    const colors = ["#ffd700", "#e10600", "#ffffff", "#0284c7", "#10b981", "#f43f5e", "#ff7a00"];

    for(let i = 0; i < 180; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * 20 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngle: 0,
        tiltAngleInc: (Math.random() * 0.07) + 0.05
      });
    }

    function renderLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.tiltAngle += p.tiltAngleInc;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 1.5;
        p.tilt = Math.sin(p.tiltAngle - (p.r / 3)) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + (p.r / 2), p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + (p.r / 2));
        ctx.stroke();

        if(p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = -20;
        }
      });
      confettiAnimationId = requestAnimationFrame(renderLoop);
    }

    if(confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
    renderLoop();
  }

  window.triggerPodiumCelebration = function(type = "win", customTitle = null) {
    createPodiumModalDOM();
    const modal = document.getElementById("podiumModal");
    const titleEl = document.getElementById("podiumTitle");
    const subEl = document.getElementById("podiumSub");
    const trophyEl = document.getElementById("podiumTrophyIco");

    if(type === "champ") {
      trophyEl.textContent = "👑";
      titleEl.textContent = "ЧЕМПИОН МИРА ФОРМУЛЫ-1!";
      subEl.textContent = "Золотой кубок победителя мира отправляется на вашу полку славы!";
    } else if(type === "win") {
      trophyEl.textContent = "🏆";
      titleEl.textContent = customTitle || "ПОБЕДА В ГРАН-ПРИ!";
      subEl.textContent = "Шампанское льётся рекой на вершине подиума!";
    } else {
      trophyEl.textContent = "🍾";
      titleEl.textContent = "ПОДИУМ ФОРМУЛЫ-1!";
      subEl.textContent = "Блестящее выступление в борьбе с сильнейшими!";
    }

    modal.style.display = "flex";
    launchConfetti();
  };

  window.closePodiumModal = function() {
    const modal = document.getElementById("podiumModal");
    if(modal) modal.style.display = "none";
    if(confettiAnimationId) {
      cancelAnimationFrame(confettiAnimationId);
      confettiAnimationId = null;
    }
  };

  // =====================================================================
  // 3. PADDOCK PRESS & NEWS FLASH
  // =====================================================================
  function createPressModalDOM() {
    if(document.getElementById("pressModal")) return;
    const m = document.createElement("div");
    m.id = "pressModal";
    m.className = "f1-modal-overlay";
    m.innerHTML = `
      <div class="f1-modal-card press-card">
        <div class="press-head">
          <div>
            <span class="f1-mono-sub">PADDOCK CHRONICLE // SPECIAL MOTORSPORT REPORT</span>
            <h2>📰 <span data-ru="Пресса Паддока & Заголовки" data-en="Paddock Press">Пресса Паддока</span></h2>
          </div>
          <button class="rank-x" onclick="closePressModal()">✕</button>
        </div>

        <div class="press-body" id="pressBody"></div>
      </div>
    `;
    document.body.appendChild(m);
    m.addEventListener("click", e => { if(e.target === m) closePressModal(); });
  }

  function generatePressReport() {
    createPressModalDOM();
    const body = document.getElementById("pressBody");
    if(!body) return;

    if(typeof S === "undefined" || !S || !S.cat) {
      body.innerHTML = `<div class="press-empty">Начните карьеру, чтобы следить за репортажами журналистов!</div>`;
      return;
    }

    const lastSeason = S.seasons && S.seasons.length ? S.seasons[S.seasons.length - 1] : null;
    const drvName = (typeof sel !== "undefined" && sel.name) ? sel.name.toUpperCase() : "ПИЛОТ";
    const tmName = S.team ? S.team.name : (S.tpTeam || "Free Agent");
    const pos = lastSeason ? lastSeason.pos : null;
    const wins = lastSeason ? (lastSeason.wins || 0) : 0;
    const isChamp = pos === 1;

    let mainHeadline = "";
    let mainStory = "";
    let rating = 7.5;

    if(isChamp) {
      rating = 9.8;
      mainHeadline = `👑 НЕОСПОРИМЫЙ ТРИУМФ: ${drvName} И ${tmName} — ЧЕМПИОНЫ МИРА!`;
      mainStory = `Сезон завершился безоговорочным доминированием. Эксперты паддока сходятся во мнении: пилотаж ${drvName} в этом году вошёл в учебники гоночной стратегии. Главные соперники признают поражение.`;
    } else if(wins >= 3) {
      rating = 8.9;
      mainHeadline = `⚡ ${drvName} ВЗРЫВАЕТ ПЕЛАТОН: ${wins} ПОБЕД И БОРЬБА ЗА ВЕРШИНУ!`;
      mainStory = `Конюшня ${tmName} нашла победный ключ к настройкам. Несколько ярких побед заставили фанатов ликовать на трибунах. Сезон выдался по-настоящему огненным.`;
    } else if(pos && pos <= 5) {
      rating = 8.2;
      mainHeadline = `📈 СТАБИЛЬНОСТЬ ЭЛИТЫ: ${drvName} ЗАКРЕПЛЯЕТСЯ В ТОП-5 МИРА`;
      mainStory = `Уверенное завершение чемпионата. Пилот выжимал максимум из имеющейся техники и неоднократно навязывал борьбу лидерам чемпионата.`;
    } else {
      rating = 6.8;
      mainHeadline = `🏁 НАПРЯЖЁННЫЙ ГОД: ${drvName} БОРЕТСЯ В ПЛОТНОЙ СЕРЕДИНЕ`;
      mainStory = `Борьба в пелотоне была ожесточённой. Механики и гоночный инженер анализируют телеметрию и готовят обновления аэродинамики к следующему этапу.`;
    }

    body.innerHTML = `
      <div class="newspaper-header">
        <div class="np-title">THE MOTORSPORT CHRONICLE</div>
        <div class="np-date">SPECIAL EDITION · ПАДДОК F1 · СЕЗОН ${lastSeason ? lastSeason.year : 2026}</div>
      </div>

      <div class="newspaper-lead-story">
        <div class="np-rating-badge">ОЦЕНКА ЭКСПЕРТОВ: ⭐ <b>${rating} / 10</b></div>
        <h3 class="np-main-headline">${mainHeadline}</h3>
        <p class="np-main-p">${mainStory}</p>
      </div>

      <div class="paddock-snippets-grid">
        <div class="np-snippet">
          <div class="np-source">🇮🇹 LA GAZZETTA DELLO SPORT</div>
          <div class="np-snippet-txt">«Темп ${drvName} в быстрых поворотах поразил наших инженеров. Будущее за такими гонщиками».</div>
        </div>
        <div class="np-snippet">
          <div class="np-source">🇬🇧 AUTOSPORT MAGAZINE</div>
          <div class="np-snippet-txt">«Дуэль внутри ${tmName} завершилась в пользу хладнокровия и чистого таланта».</div>
        </div>
        <div class="np-snippet">
          <div class="np-source">🇫🇷 L'ÉQUIPE</div>
          <div class="np-snippet-txt">«В паддоке уже ходят слухи о возможном продлении многомиллионного контракта на новый срок».</div>
        </div>
      </div>
    `;
  }

  window.openPressModal = function() {
    generatePressReport();
    const m = document.getElementById("pressModal");
    if(m) m.style.display = "flex";
  };
  window.closePressModal = function() {
    const m = document.getElementById("pressModal");
    if(m) m.style.display = "none";
  };

  // =====================================================================
  // INITIALIZATION & HOOKS
  // =====================================================================
  function initModule() {
    createWealthModalDOM();
    createPodiumModalDOM();
    createPressModalDOM();

    // Add Press & Wealth buttons in driverCardExtraBtns
    const actWrap = document.getElementById("driverCardExtraBtns");
    if(actWrap && !document.getElementById("btnPressDriver")) {
      const bPress = document.createElement("button");
      bPress.id = "btnPressDriver";
      bPress.className = "btn ghost btn-extra-tool";
      bPress.innerHTML = "📰 Пресса";
      bPress.onclick = openPressModal;
      actWrap.appendChild(bPress);

      const bWealth = document.createElement("button");
      bWealth.id = "btnWealthDriver";
      bWealth.className = "btn ghost btn-extra-tool";
      bWealth.innerHTML = "💰 Гараж";
      bWealth.onclick = openWealthModal;
      actWrap.appendChild(bWealth);
    }

    // Add Press link to intro
    const introLinks = document.querySelector(".intro-links");
    if(introLinks && !document.getElementById("introPressLink")) {
      const sep = document.createElement("span");
      sep.className = "il-sep";
      sep.textContent = "·";
      const a = document.createElement("a");
      a.id = "introPressLink";
      a.onclick = openPressModal;
      a.textContent = "📰 Пресса F1";
      introLinks.appendChild(sep);
      introLinks.appendChild(a);
    }

    updateWealthUI();
  }

  // Hook into season finish: add earnings and trigger podium if won
  const origTimeline = window.renderTimeline;
  window.renderTimeline = function() {
    if(typeof origTimeline === "function") origTimeline.apply(this, arguments);
    try {
      if(S && S.seasons && S.seasons.length) {
        const last = S.seasons[S.seasons.length - 1];
        if(!last._wealthGiven) {
          last._wealthGiven = true;
          addSeasonEarnings(last);
          if(last.pos === 1) {
            triggerPodiumCelebration("champ");
          } else if(last.wins && last.wins > 0) {
            triggerPodiumCelebration("win", `ПОБЕДА В ${last.wins} ГРАН-ПРИ!`);
          } else if(last.pos && last.pos <= 3) {
            triggerPodiumCelebration("podium");
          }
        }
      }
    } catch(e){}
  };

  if(document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initModule);
  } else {
    initModule();
  }
})();
