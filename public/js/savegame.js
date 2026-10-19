/* =====================================================================
   F1 Glory · Save / Load / Cloud & Export System
   Модуль сохранений, экспорта в JSON и автосохранения
   ===================================================================== */

(function(){
  const SLOTS_COUNT = 3;
  const AUTOSAVE_KEY = "f1g_autosave";
  const SLOT_PREFIX = "f1g_save_slot_";
  const SETTINGS_KEY = "f1g_user_settings";

  // UI Toast notification
  function showToast(msg, type="info") {
    let t = document.getElementById("f1Toast");
    if(!t){
      t = document.createElement("div");
      t.id = "f1Toast";
      document.body.appendChild(t);
    }
    const ico = type==="success" ? "✅ " : type==="error" ? "⚠️ " : "ℹ️ ";
    t.innerHTML = `<span class="t-ico">${ico}</span><span class="t-msg">${msg}</span>`;
    t.className = `f1-toast show ${type}`;
    clearTimeout(t._timer);
    t._timer = setTimeout(() => {
      t.className = "f1-toast";
    }, 3200);
  }
  window.showF1Toast = showToast;

  // Helpers to get game state object
  function getGameStateSnapshot(customName = null) {
    if(typeof S === "undefined" || !S || !S.cat) return null;
    const isTP = S.cat === "TP" || (typeof TP_MODE !== "undefined" && TP_MODE);
    const drvName = (typeof sel !== "undefined" && sel.name) ? sel.name : (isTP ? "Team Principal" : "Driver");
    const tm = S.team ? S.team.name : (S.tpTeam || "Free Agent");
    const yr = (typeof yearNow === "function") ? yearNow() : (S.baseYear + (S.age - (S.startAge || 16)));

    return {
      version: 1,
      createdAt: Date.now(),
      saveTitle: customName || `${drvName} · ${tm} (${yr})`,
      summary: {
        name: drvName,
        team: tm,
        year: yr,
        age: S.age,
        ovr: isTP ? (S.tpPrest || 50) : (S.ovr || 50),
        cat: S.cat,
        isTP: isTP,
        flag: (typeof sel !== "undefined" && sel.flag) ? sel.flag : "🏁",
        titlesF1: (S.titles && S.titles.f1) || 0,
        titlesConstr: (S.titles && S.titles.constr) || 0,
        wins: S.wins || 0,
        gp: S.gp || 0,
        era: (typeof SELECTED_ERA !== "undefined" ? SELECTED_ERA : "2026")
      },
      data: {
        S: JSON.parse(JSON.stringify(S)),
        sel: (typeof sel !== "undefined") ? JSON.parse(JSON.stringify(sel)) : {},
        SELECTED_ERA: (typeof SELECTED_ERA !== "undefined") ? SELECTED_ERA : "2026",
        TP_MODE: isTP,
        CHALLENGE: (typeof CHALLENGE !== "undefined") ? CHALLENGE : null,
        activePanel: (typeof deckPanelActivo === "function") ? deckPanelActivo() : "decisionBox",
        CEO_STATE: localStorage.getItem("f1g_ceo_state") || null
      }
    };
  }

  // Restore game state
  function restoreGameStateSnapshot(snapshot) {
    if(!snapshot || !snapshot.data || !snapshot.data.S) {
      showToast("Ошибка структуры файла сохранения!", "error");
      return false;
    }
    const d = snapshot.data;

    // Restore globals
    window.S = d.S;
    if(typeof sel !== "undefined" && d.sel) {
      Object.assign(window.sel, d.sel);
    } else {
      window.sel = d.sel;
    }
    window.SELECTED_ERA = d.SELECTED_ERA || "2026";
    window.TP_MODE = !!d.TP_MODE;
    window.CHALLENGE = d.CHALLENGE || null;

    if(d.CEO_STATE) {
      try {
        localStorage.setItem("f1g_ceo_state", d.CEO_STATE);
        if(typeof window.initCeoMode === "function") window.initCeoMode();
      } catch(e){}
    }

    // Hide intro, modals
    const hideIds = ["intro", "identity", "rankingModal", "patronModal", "tpGridModal", "cheatModal"];
    hideIds.forEach(id => {
      const el = document.getElementById(id);
      if(el) el.style.display = "none";
    });

    const carSec = document.getElementById("career");
    if(carSec) carSec.style.display = "block";

    // Close save modal
    closeSaveModal();

    // Re-render UI
    try {
      if(typeof refreshCard === "function") refreshCard();
      if(typeof renderTimeline === "function") renderTimeline();
      if(typeof renderF1State === "function") renderF1State();
      if(typeof deckActualiza === "function") deckActualiza();
      if(typeof updateCareerHud === "function") updateCareerHud();

      // Team colors
      const curTeam = S.team || (S.tpTeam && typeof F1_TEAMS !== "undefined" ? F1_TEAMS.find(t=>t.name===S.tpTeam) : null);
      if(typeof pintaColorEquipo === "function") pintaColorEquipo(curTeam);

      // Tab
      if(typeof deckIr === "function") {
        deckIr(d.activePanel || "decisionBox");
      }

      // Check if end of career or CEO mode transition
      if(S.retired) {
        if(S.retiredByCeo && typeof window.transitionToCeoPage === "function") {
          window.transitionToCeoPage(false);
        } else if(typeof endCareer === "function") {
          endCareer();
        }
      }

      if(typeof window.updateCeoIntroCard === "function") {
        window.updateCeoIntroCard();
      }
    } catch(err) {
      console.warn("UI refresh after load:", err);
    }

    showToast(`🏁 Карьера загружена: ${snapshot.summary ? snapshot.summary.name : 'Пилот'}!`, "success");
    return true;
  }

  // Save to slot
  function saveToSlot(slotIdx, customName = null) {
    const snap = getGameStateSnapshot(customName);
    if(!snap) {
      showToast("Нет активной карьеры для сохранения!", "error");
      return false;
    }
    try {
      const key = slotIdx === "auto" ? AUTOSAVE_KEY : `${SLOT_PREFIX}${slotIdx}`;
      localStorage.setItem(key, JSON.stringify(snap));
      renderSaveModal();
      showToast(slotIdx === "auto" ? "Автосохранение выполнено" : `Сохранено в Слот #${slotIdx}!`, "success");
      return true;
    } catch(e) {
      showToast("Ошибка сохранения в localStorage: " + e.message, "error");
      return false;
    }
  }

  // Load from slot
  function loadFromSlot(slotIdx) {
    try {
      const key = slotIdx === "auto" ? AUTOSAVE_KEY : `${SLOT_PREFIX}${slotIdx}`;
      const raw = localStorage.getItem(key);
      if(!raw) {
        showToast("Слот сохранения пуст!", "error");
        return false;
      }
      const snap = JSON.parse(raw);
      return restoreGameStateSnapshot(snap);
    } catch(e) {
      showToast("Ошибка чтения сохранения: " + e.message, "error");
      return false;
    }
  }

  // Delete slot
  function deleteSlot(slotIdx) {
    const key = slotIdx === "auto" ? AUTOSAVE_KEY : `${SLOT_PREFIX}${slotIdx}`;
    localStorage.removeItem(key);
    renderSaveModal();
    showToast(`Слот #${slotIdx} очищен`, "info");
  }

  // Export to JSON file
  function exportSaveToFile(slotIdx) {
    let snap = null;
    if(slotIdx === "current") {
      snap = getGameStateSnapshot();
    } else {
      const key = slotIdx === "auto" ? AUTOSAVE_KEY : `${SLOT_PREFIX}${slotIdx}`;
      const raw = localStorage.getItem(key);
      if(raw) snap = JSON.parse(raw);
    }

    if(!snap) {
      showToast("Нет данных для экспорта!", "error");
      return;
    }

    const s = snap.summary || {};
    const safeName = (s.name || "driver").toLowerCase().replace(/[^a-z0-9]/g, "_");
    const fileName = `f1glory_${safeName}_${s.year || 2026}_ovr${s.ovr || 50}.json`;

    const blob = new Blob([JSON.stringify(snap, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Файл ${fileName} успешно сохранён!`, "success");
  }

  // Import from JSON file
  function importSaveFromFile(file) {
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const snap = JSON.parse(e.target.result);
        if(!snap.data || !snap.data.S) {
          throw new Error("Неверный формат сохранения F1 Glory");
        }
        restoreGameStateSnapshot(snap);
        // Also save to slot 1 as backup
        localStorage.setItem(`${SLOT_PREFIX}1`, JSON.stringify(snap));
      } catch(err) {
        showToast("Ошибка импорта файла: " + err.message, "error");
      }
    };
    reader.readAsText(file);
  }

  // Check autosave on page load
  function checkAutosaveOnIntro() {
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      if(!raw) return;
      const snap = JSON.parse(raw);
      if(!snap || !snap.summary) return;

      const introSec = document.getElementById("intro");
      if(!introSec) return;

      let btn = document.getElementById("introContinueBtn");
      if(!btn) {
        btn = document.createElement("button");
        btn.id = "introContinueBtn";
        btn.className = "btn f1-continue-btn";
        btn.onclick = () => loadFromSlot("auto");
        const cardCareer = document.getElementById("careerCard");
        if(cardCareer && cardCareer.parentNode) {
          cardCareer.parentNode.insertBefore(btn, cardCareer);
        }
      }

      const s = snap.summary;
      const yr = s.year || 2026;
      const tm = s.team || "Без команды";
      const nm = s.name || "Пилот";
      btn.innerHTML = `
        <span class="cont-pulse"></span>
        <span class="cont-txt">
          <b>▶ Продолжить карьеру: ${s.flag || "🏁"} ${nm}</b>
          <small>${tm} · Сезон ${yr} · OVR ${s.ovr}</small>
        </span>
      `;
      btn.style.display = "flex";
    } catch(e){}
  }

  // Autosave trigger
  window.triggerF1Autosave = function() {
    try {
      if(typeof S !== "undefined" && S && S.cat && !S.retired) {
        const snap = getGameStateSnapshot();
        if(snap) {
          localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(snap));
          checkAutosaveOnIntro();
        }
      }
    } catch(e){}
  };

  // Build Save Modal
  function createSaveModalDOM() {
    if(document.getElementById("saveModal")) return;

    const modal = document.createElement("div");
    modal.id = "saveModal";
    modal.innerHTML = `
      <div class="save-card">
        <div class="save-head">
          <div class="save-title-wrap">
            <div class="save-telemetry">TELEMETRY SAVE SYSTEM // FIA ARCHIVE</div>
            <h2>💾 <span data-ru="Управление сохранениями" data-en="Save Management" data-es="Gestión de partidas">Управление сохранениями</span></h2>
          </div>
          <button class="save-x" onclick="closeSaveModal()">✕</button>
        </div>

        <div class="save-actions-bar">
          <button class="btn save-quick-btn" onclick="saveActiveCareerNow()">
            💾 <span data-ru="Сохранить текущую карьеру" data-en="Quick Save Career">Сохранить текущую карьеру</span>
          </button>
          <label class="btn ghost file-upload-lbl">
            📥 <span data-ru="Импорт JSON" data-en="Import JSON">Импорт JSON</span>
            <input type="file" id="f1SaveFileInput" accept=".json" style="display:none" onchange="handleSaveFileUpload(event)">
          </label>
        </div>

        <div class="save-slots-list" id="saveSlotsList"></div>

        <div class="save-footer">
          <small data-ru="Совет: Карьера автоматически сохраняется после каждого сезона. Вы также можете экспортировать JSON-файл для переноса на другое устройство."
                 data-en="Tip: Career autosaves after each season. You can export JSON file to transfer between devices.">
            Совет: Карьера сохраняется в браузере. Вы можете скачать файл JSON для резервной копии.
          </small>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener("click", function(e){
      if(e.target === modal) closeSaveModal();
    });
  }

  function renderSaveSlotCard(slotIdx, title, isAuto = false) {
    const key = isAuto ? AUTOSAVE_KEY : `${SLOT_PREFIX}${slotIdx}`;
    let snap = null;
    try {
      const raw = localStorage.getItem(key);
      if(raw) snap = JSON.parse(raw);
    } catch(e){}

    const hasData = !!(snap && snap.summary);
    const s = hasData ? snap.summary : null;
    const dateStr = snap && snap.createdAt ? new Date(snap.createdAt).toLocaleString() : "";

    return `
      <div class="save-slot-row ${hasData ? 'occupied' : 'empty'} ${isAuto ? 'autosave-row' : ''}">
        <div class="slot-badge">${isAuto ? '🔄 АВТО' : `#${slotIdx}`}</div>
        <div class="slot-info">
          ${hasData ? `
            <div class="slot-title">
              <span class="slot-flag">${s.flag || "🏁"}</span>
              <b>${s.name}</b>
              <span class="slot-mode ${s.isTP ? 'tp' : 'drv'}">${s.isTP ? 'TEAM PRINCIPAL' : 'DRIVER'}</span>
            </div>
            <div class="slot-meta">
              <span>🏎️ ${s.team}</span> · 
              <span>📅 Сезон ${s.year}</span> · 
              <span>⭐ OVR ${s.ovr}</span> · 
              <span>🏆 Титулы: ${s.titlesF1 || 0}</span>
            </div>
            <div class="slot-date">🕒 Сохранено: ${dateStr}</div>
          ` : `
            <div class="slot-empty-txt">Пустой слот сохранения</div>
            <div class="slot-empty-sub">Готов к записи карьеры</div>
          `}
        </div>
        <div class="slot-btns">
          ${hasData ? `
            <button class="btn s-btn load" onclick="loadFromSaveSlot('${isAuto ? 'auto' : slotIdx}')">▶ Загрузить</button>
            <button class="btn ghost s-btn" onclick="exportFromSaveSlot('${isAuto ? 'auto' : slotIdx}')" title="Скачать JSON">💾 Экспорт</button>
            ${!isAuto ? `<button class="btn ghost s-btn save-over" onclick="saveToSaveSlot(${slotIdx})" title="Перезаписать">🔄</button>` : ''}
            <button class="btn ghost s-btn del" onclick="deleteSaveSlot('${isAuto ? 'auto' : slotIdx}')" title="Удалить">🗑️</button>
          ` : `
            <button class="btn s-btn save" onclick="saveToSaveSlot(${slotIdx})">💾 Сохранить</button>
          `}
        </div>
      </div>
    `;
  }

  function renderSaveModal() {
    const list = document.getElementById("saveSlotsList");
    if(!list) return;

    let html = "";
    // Auto-save row
    html += renderSaveSlotCard(0, "Автосохранение", true);

    // 3 manual slots
    for(let i = 1; i <= SLOTS_COUNT; i++) {
      html += renderSaveSlotCard(i, `Слот #${i}`, false);
    }

    list.innerHTML = html;
  }

  window.openSaveModal = function() {
    createSaveModalDOM();
    renderSaveModal();
    const modal = document.getElementById("saveModal");
    if(modal) modal.style.display = "flex";
  };

  window.closeSaveModal = function() {
    const modal = document.getElementById("saveModal");
    if(modal) modal.style.display = "none";
  };

  window.saveToSaveSlot = function(slotIdx) {
    saveToSlot(slotIdx);
  };

  window.loadFromSaveSlot = function(slotIdx) {
    loadFromSlot(slotIdx);
  };

  window.exportFromSaveSlot = function(slotIdx) {
    exportSaveToFile(slotIdx);
  };

  window.deleteSaveSlot = function(slotIdx) {
    if(confirm(`Удалить сохранение в ${slotIdx === 'auto' ? 'автосохранении' : 'слоте #' + slotIdx}?`)) {
      deleteSlot(slotIdx);
    }
  };

  window.saveActiveCareerNow = function() {
    if(typeof S === "undefined" || !S || !S.cat) {
      showToast("Сначала начните карьеру!", "error");
      return;
    }
    // Save to slot 1 by default or auto
    saveToSlot(1);
  };

  window.handleSaveFileUpload = function(event) {
    const file = event.target.files && event.target.files[0];
    if(file) {
      importSaveFromFile(file);
      event.target.value = "";
    }
  };

  // Keyboard shortcut: F4 opens save menu, Ctrl+S quicksaves
  window.addEventListener("keydown", function(e){
    if(e.key === "F4") {
      e.preventDefault();
      const modal = document.getElementById("saveModal");
      if(modal && modal.style.display === "flex") closeSaveModal();
      else openSaveModal();
    }
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      if(typeof S !== "undefined" && S && S.cat) {
        e.preventDefault();
        saveToSlot("auto");
      }
    }
  });

  // Init button in intro and HUD
  function initSaveUIHooks() {
    createSaveModalDOM();
    checkAutosaveOnIntro();

    // Add button in topBtns if not present
    const topBtns = document.getElementById("topBtns");
    if(topBtns && !document.getElementById("saveToggle")) {
      const btn = document.createElement("button");
      btn.id = "saveToggle";
      btn.onclick = openSaveModal;
      btn.title = "Сохранения и слоты (F4)";
      btn.innerHTML = "💾";
      topBtns.appendChild(btn);
    }

    // Add button in intro links
    const introLinks = document.querySelector(".intro-links");
    if(introLinks && !document.getElementById("introSaveLink")) {
      const sep = document.createElement("span");
      sep.className = "il-sep";
      sep.textContent = "·";
      const a = document.createElement("a");
      a.id = "introSaveLink";
      a.onclick = openSaveModal;
      a.setAttribute("data-ru", "💾 Сохранения");
      a.setAttribute("data-en", "💾 Save / Load");
      a.setAttribute("data-es", "💾 Partidas");
      a.textContent = "💾 Сохранения";
      introLinks.appendChild(sep);
      introLinks.appendChild(a);
    }

    // Add save button in HUD
    const hudRight = document.querySelector(".career-hud .hud-right");
    if(hudRight && !document.getElementById("hudSaveBtn")) {
      const hudSave = document.createElement("button");
      hudSave.id = "hudSaveBtn";
      hudSave.className = "hud-save-btn";
      hudSave.title = "Сохранить карьеру (Ctrl+S / F4)";
      hudSave.innerHTML = `💾 <span class="hsb-txt">SAVE</span>`;
      hudSave.onclick = openSaveModal;
      hudRight.appendChild(hudSave);
    }
  }

  if(document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSaveUIHooks);
  } else {
    initSaveUIHooks();
  }
})();
