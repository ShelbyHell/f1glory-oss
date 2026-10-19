/* =====================================================================
   F1 Glory · Team Radio & Verstappen F3->F1 Historic Scenario
   Модуль радиопереговоров гоночного инженера и сценария Макса Ферстаппена
   ===================================================================== */

(function(){
  // =====================================================================
  // 1. WEB AUDIO API SYNTHESIZER (F1 RADIO BEEP & EFFECTS)
  // =====================================================================
  let audioCtx = null;
  let audioMuted = false;

  function getAudioContext() {
    if(!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if(AudioContext) audioCtx = new AudioContext();
    }
    if(audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playRadioBeep() {
    if(audioMuted) return;
    try {
      const ctx = getAudioContext();
      if(!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";

      // Two quick F1 Team Radio chirps: ~1200Hz -> ~1800Hz
      const t = ctx.currentTime;
      osc.frequency.setValueAtTime(1250, t);
      osc.frequency.setValueAtTime(1750, t + 0.04);
      osc.frequency.setValueAtTime(1250, t + 0.08);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.15);
    } catch(e){}
  }
  window.playF1RadioBeep = playRadioBeep;

  // =====================================================================
  // 2. TEAM RADIO ENGINEER MESSAGES
  // =====================================================================
  const RADIO_MESSAGES = [
    { type: "attack", eng: "Scenario 7, Mode Push. You have DRS, close the gap now!", ru: "Режим Scenario 7, атакуй! У тебя DRS, достань его в зоне торможения!" },
    { type: "tyres", eng: "Bono, my tyres are completely gone... Copy that, hammer time!", ru: "«Боно, шины кончились!» — Принято, выжимай всё до капли, Hammer Time!" },
    { type: "box", eng: "Box, box, box! New set of softs ready in the pit lane!", ru: "Бокс, бокс, бокс! Свежий комплект Soft ждёт на пит-лейн!" },
    { type: "teammate", eng: "Fernando is faster than you. Can you confirm you understood that message?", ru: "«Напарник быстрее тебя». Подтверди, что ты понял сообщение команды." },
    { type: "weather", eng: "Heavy rain reported in turn 3. Track is getting very slippery, stay alert!", ru: "В 3-м повороте начинается ливень. Трасса скользкая, предельная концентрация!" },
    { type: "kimi", eng: "Leave me alone, I know what I'm doing!", ru: "«Оставьте меня в покое, я сам знаю, что делать!»" },
    { type: "max_win", eng: "Simply lovely! Haha, yes boys! What a mega drive, mate! P1!", ru: "Simply lovely! Да, парни! Какая мега-гонка, ты первый! P1!" }
  ];

  function showTeamRadioFlash(msgObj = null) {
    playRadioBeep();
    const item = msgObj || RADIO_MESSAGES[Math.floor(Math.random() * RADIO_MESSAGES.length)];
    let box = document.getElementById("teamRadioBox");
    if(!box) {
      box = document.createElement("div");
      box.id = "teamRadioBox";
      box.className = "team-radio-box";
      document.body.appendChild(box);
    }

    const engineerName = (typeof S !== "undefined" && S && S.team && S.team.name === "Red Bull") ? "GIANPIERO LAMBIASE" :
                         (typeof S !== "undefined" && S && S.team && S.team.name === "Ferrari") ? "RICCARDO ADAMI" :
                         (typeof S !== "undefined" && S && S.team && S.team.name === "Mercedes") ? "PETER BONNINGTON" : "RACE ENGINEER";

    box.innerHTML = `
      <div class="tr-top">
        <span class="tr-wave"><span></span><span></span><span></span><span></span></span>
        <span class="tr-title">📻 TEAM RADIO // ${engineerName}</span>
        <button class="tr-x" onclick="closeTeamRadio()">✕</button>
      </div>
      <div class="tr-msg-ru">${item.ru}</div>
      <div class="tr-msg-orig">«${item.eng}»</div>
    `;

    box.className = "team-radio-box show";
    clearTimeout(box._timer);
    box._timer = setTimeout(() => {
      box.className = "team-radio-box";
    }, 6000);
  }
  window.triggerTeamRadio = showTeamRadioFlash;
  window.closeTeamRadio = function() {
    const box = document.getElementById("teamRadioBox");
    if(box) {
      if(box._timer) {
        clearTimeout(box._timer);
        box._timer = null;
      }
      box.className = "team-radio-box";
      box.innerHTML = "";
    }
  };

  // =====================================================================
  // 3. VERSTAPPEN F3 -> F1 HISTORIC SCENARIO
  // =====================================================================
  function setupVerstappenChallenge() {
    if(typeof CHALLENGES === "undefined") return;

    // Define max15 scenario
    CHALLENGES.max15 = {
      id: "max15",
      era: "2010",
      year: 2015,
      team: "Toro Rosso",
      role: "1",
      secret: false,
      who: {
        born: 1997,
        age: 17,
        ovr: 79,
        ceil: 99,
        flag: "🇳🇱",
        country: "Países Bajos",
        style: "agresivo",
        num: "33"
      },
      drop: ["M. Verstappen"],
      t: [
        "Ферстаппен",
        "Verstappen",
        "Verstappen"
      ],
      sub: [
        "Феномен F3 ➔ F1 · 17 лет · Toro Rosso 2015",
        "F3 to F1 Phenomenon · Age 17 · Toro Rosso 2015",
        "Fenômeno F3 para F1 · 17 anos · Toro Rosso 2015"
      ],
      d: [
        "Октябрь 2014 года. Тебе всего 17 лет. После сенсационной серии из 6 побед подряд в европейской Формуле-3 доктор Хельмут Марко делает беспрецедентное предложение: подписать контракт с Red Bull и СРАЗУ, минуя Формулу-2, сесть за руль боевого болида Toro Rosso в Формуле-1 на сезон 2015 года! Паддок бурлит: критики называют это безрассудством, а FIA уже готовит запрет на суперлицензии до 18 лет («правило Ферстаппена»). Твой напарник — голодный Карлос Сайнс, а впереди маячит место в Red Bull Racing. Докажи, что ты быстрейший вундеркинд в истории гонок!",
        "October 2014. You are just 17 years old. After a sensational streak of 6 straight wins in European Formula 3, Dr. Helmut Marko makes an unprecedented offer: sign with Red Bull and IMMEDIATELY jump into Formula 1 with Toro Rosso for 2015, completely skipping GP2/F2! The paddock is outraged: critics call it reckless madness, and the FIA is already drafting a rule banning under-18 drivers ('the Verstappen rule'). Your teammate is hungry Carlos Sainz, and a Red Bull seat looms ahead. Prove you are the fastest prodigy in racing history!",
        "Outubro de 2014. Você tem apenas 17 anos. Após uma sequência sensacional de 6 vitórias seguidas na Fórmula 3 europeia, Helmut Marko faz uma oferta inédita: pular a GP2/F2 e estrear direto na F1 pela Toro Rosso em 2015! Prove que você é o maior prodígio da história!"
      ],
      champ: "L. Hamilton",
      persona: "VERSTAPPEN",
      bench: { titles: 4, wins: 63, poles: 40, podiums: 111 },
      benchName: [
        "Реальный Макс Ферстаппен (4 титула, 60+ побед)",
        "Real Max Verstappen (4 titles, 60+ wins)",
        "Max Verstappen real (4 títulos, 60+ vitórias)"
      ],
      at: "2026-10-19T12:00:00Z"
    };
  }

  // Launch scenario handler
  window.startVerstappenScenario = function() {
    setupVerstappenChallenge();
    if(typeof launchChallenge === "function") {
      launchChallenge("max15");
    } else if(typeof challengePick === "function") {
      challengePick("max15");
    } else {
      // Manual trigger
      window.CHALLENGE = "max15";
      window.TP_MODE = false;
      window.SELECTED_ERA = "2010";
      const ch = CHALLENGES.max15;
      if(typeof sel !== "undefined") {
        sel.name = "VERSTAPPEN";
        sel.num = "33";
        sel.flag = "🇳🇱";
        sel.country = "Países Bajos";
        sel.style = "agresivo";
      }
      if(typeof startCareer === "function") startCareer();
    }
  };

  // =====================================================================
  // 4. UI HOOKS & BUTTONS
  // =====================================================================
  function initHooks() {
    setupVerstappenChallenge();

    // Enable native challengeCard in intro smoothly
    const card = document.getElementById("challengeCard");
    const grid = document.getElementById("challengeGrid");
    if(card && grid) {
      card.classList.remove("soon");
      card.classList.add("retro-on");
      const badge = document.getElementById("badgeReto");
      if(badge) {
        badge.className = "new-badge";
        badge.textContent = (typeof LANG !== "undefined" && LANG === "ru") ? "Новинка!" : "¡Nuevo!";
        badge.style.display = "inline-block";
      }
      const sub = document.getElementById("retoSub");
      if(sub) {
        sub.textContent = (typeof LANG !== "undefined" && LANG === "ru") ?
          "Макс Ферстаппен: Прыжок из F3 в F1" : "Max Verstappen: F3 to F1 Jump";
      }
      // Click handler toggles native challenge grid
      card.onclick = function() {
        const isOpen = grid.style.display !== "none";
        grid.style.display = isOpen ? "none" : "block";
        card.classList.toggle("open", !isOpen);
      };
    }

    // Ensure challengeGrid is cleanly populated with native tiles
    if(typeof initSecretChallenges === "function") {
      try { initSecretChallenges(); } catch(e){}
    }

    // 2. Add Radio button in HUD
    const hudRight = document.querySelector(".career-hud .hud-right");
    if(hudRight && !document.getElementById("hudRadioBtn")) {
      const radioBtn = document.createElement("button");
      radioBtn.id = "hudRadioBtn";
      radioBtn.className = "hud-radio-btn";
      radioBtn.title = "Радиопереговоры с гоночным инженером";
      radioBtn.innerHTML = `📻 <span class="hrb-txt">RADIO</span>`;
      radioBtn.onclick = () => showTeamRadioFlash();
      hudRight.insertBefore(radioBtn, hudRight.firstChild);
    }
  }

  // Trigger radio sound & message on key decision screens
  const origSetDecision = window.setDecision;
  window.setDecision = function() {
    if(typeof origSetDecision === "function") origSetDecision.apply(this, arguments);
    try {
      if(Math.random() < 0.35) {
        setTimeout(() => showTeamRadioFlash(), 600);
      }
    } catch(e){}
  };

  if(document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHooks);
  } else {
    initHooks();
  }
})();
