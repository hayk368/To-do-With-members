import { a as t, saveTasks } from './data.js';
import { b as m } from './members.js';
import { openModal, closeModal } from './modal.js';

const lol = document.querySelector(".lol");
const e = document.querySelector("input[placeholder='serch task']");

let cm = "all";
let cdFilter = "all";
let onUpdateCallback = null;

export function setOnTasksUpdated(cb) {
  onUpdateCallback = cb;
}

function notifyUpdate() {
  if (typeof onUpdateCallback === "function") {
    onUpdateCallback();
  }
}

export function hasMember(ids, targetId) {
  if (ids === "all") return true;
  if (!Array.isArray(ids)) return false;
  for (const id of ids) {
    if (String(id) === String(targetId)) return true;
  }
  return false;
}

export function getMemberTasks(memberId) {
  const res = [];
  for (const k of t) {
    if (hasMember(k.memberIds, memberId)) {
      res.push(k);
    }
  }
  return res;
}

function getMNames(ids) {
  if (ids === "all") return "Բոլորը (All)";
  if (!Array.isArray(ids) || ids.length === 0) return "Անհայտ";
  const n = [];
  for (const id of ids) {
    for (const x of m) {
      if (String(x.id) === String(id)) {
        n.push(x.name);
      }
    }
  }
  return n.length > 0 ? n.join(", ") : "Անհայտ";
}

export function renderTasks(f = "") {
  if (!lol) return;

  let mo = `<option value="all">👥 Բոլոր անդամները</option>`;
  for (const x of m) {
    mo += `<option value="${x.id}" ${String(cm) === String(x.id) ? 'selected' : ''}>${x.name}</option>`;
  }

  let doOpt = `<option value="all">📅 Բոլոր օրերը</option>`;
  for (let i = 1; i <= 30; i++) {
    doOpt += `<option value="${i}" ${String(cdFilter) === String(i) ? 'selected' : ''}>Օր ${i}</option>`;
  }

  let fc = document.getElementById("taskFilters");
  if (!fc) {
    const n3 = document.querySelector(".n-3");
    if (n3) {
      const div = document.createElement("div");
      div.id = "taskFilters";
      div.style.cssText = "display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;";
      div.innerHTML = `
        <select id="filterMember" style="padding: 10px 14px; background: var(--input-bg); border: 1px solid var(--border-color); border-radius: 12px; color: var(--text-main); outline: none; cursor: pointer;">${mo}</select>
        <select id="filterDay" style="padding: 10px 14px; background: var(--input-bg); border: 1px solid var(--border-color); border-radius: 12px; color: var(--text-main); outline: none; cursor: pointer;">${doOpt}</select>
      `;
      n3.insertBefore(div, lol);

      document.getElementById("filterMember").addEventListener("change", (ev) => {
        cm = ev.target.value;
        renderTasks(e ? e.value : "");
      });
      document.getElementById("filterDay").addEventListener("change", (ev) => {
        cdFilter = ev.target.value;
        renderTasks(e ? e.value : "");
      });
    }
  } else {
    document.getElementById("filterMember").innerHTML = mo;
  }

  lol.innerHTML = `
    <div class="task-col col-box-design">
      <div class="col-header">
        <div class="col-title-wrap"><span class="col-dot dot-design"></span><h3>Design</h3><span class="col-count" id="cnt-design">0</span></div>
        <button class="add-col-btn" data-cat="Design">+</button>
      </div>
      <div class="col-body col-design"></div>
    </div>
    <div class="task-col col-box-prog">
      <div class="col-header">
        <div class="col-title-wrap"><span class="col-dot dot-prog"></span><h3>Programming</h3><span class="col-count" id="cnt-prog">0</span></div>
        <button class="add-col-btn" data-cat="Programming">+</button>
      </div>
      <div class="col-body col-prog"></div>
    </div>
    <div class="task-col col-box-qa">
      <div class="col-header">
        <div class="col-title-wrap"><span class="col-dot dot-qa"></span><h3>QA & DevOps</h3><span class="col-count" id="cnt-qa">0</span></div>
        <button class="add-col-btn" data-cat="QA">+</button>
      </div>
      <div class="col-body col-qa"></div>
    </div>
  `;

  const cd = lol.querySelector(".col-design");
  const cp = lol.querySelector(".col-prog");
  const cq = lol.querySelector(".col-qa");

  for (const btn of lol.querySelectorAll(".add-col-btn")) {
    btn.addEventListener("click", () => openCreateTaskModal(btn.getAttribute("data-cat"), false));
  }

  const ft = t.filter(k => {
    const mn = getMNames(k.memberIds).toLowerCase();
    const ms = k.title.toLowerCase().includes(f.toLowerCase()) ||
               k.description.toLowerCase().includes(f.toLowerCase()) ||
               mn.includes(f.toLowerCase());

    const mm = cm === "all" || hasMember(k.memberIds, cm);
    const md = cdFilter === "all" || Number(k.day) === Number(cdFilter);

    return ms && mm && md;
  });

  let n1 = 0, n2 = 0, n3 = 0;
  for (const k of ft) {
    const l = createCard(k, false);
    const cat = (k.category || "").toLowerCase();

    if (cat.includes("design")) { cd.append(l); n1++; }
    else if (cat.includes("prog") || cat.includes("dev")) { cp.append(l); n2++; }
    else { cq.append(l); n3++; }
  }

  document.getElementById("cnt-design").textContent = n1;
  document.getElementById("cnt-prog").textContent = n2;
  document.getElementById("cnt-qa").textContent = n3;

  checkEmpty(cd, "Design");
  checkEmpty(cp, "Programming");
  checkEmpty(cq, "QA");
}

export function renderAllTasksPage(f = "") {
  if (!lol) return;

  lol.innerHTML = `
    <div style="width: 100%; display: flex; flex-direction: column; gap: 18px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 style="font-size: 20px; color: var(--text-main);">Բոլոր Task-երը (${t.length})</h2>
        <button id="pgAddBtn" style="padding: 9px 18px; background: linear-gradient(135deg, #38bdf8, #8b5cf6); color: #fff; border: none; border-radius: 10px; font-weight: 600; cursor: pointer;">+ Նոր Task</button>
      </div>
      <div id="allTasksGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; width: 100%;"></div>
    </div>
  `;

  document.getElementById("pgAddBtn").addEventListener("click", () => {
    openCreateTaskModal("Design", true);
  });

  const gr = document.getElementById("allTasksGrid");
  const ft = t.filter(k => {
    const mn = getMNames(k.memberIds).toLowerCase();
    return k.title.toLowerCase().includes(f.toLowerCase()) ||
           k.description.toLowerCase().includes(f.toLowerCase()) ||
           mn.includes(f.toLowerCase());
  });

  if (ft.length === 0) {
    gr.innerHTML = `<p style="color: var(--text-muted); padding: 20px;">Task-եր չեն գտնվել:</p>`;
    return;
  }

  for (const k of ft) {
    gr.append(createCard(k, true));
  }
}

function createCard(k, isPage) {
  const l = document.createElement("div");
  const cat = (k.category || "Design").toLowerCase();
  let bc = "badge-design";
  if (cat.includes("prog") || cat.includes("dev")) bc = "badge-prog";
  else if (!cat.includes("design")) bc = "badge-qa";

  const mn = getMNames(k.memberIds);

  l.className = `task-item-card card-${bc}`;
  l.innerHTML = `
    <div class="card-top">
      <span class="cat-badge ${bc}">${k.category || 'Design'}</span>
      <span class="day-badge">📅 Օր ${k.day || 1}</span>
    </div>
    <h1 class="card-title">${k.title}</h1>
    <p class="card-desc">${k.description}</p>
    <div class="card-footer">
      <div class="member-pill">
        <span class="member-avatar">${mn[0]}</span>
        <span>${mn}</span>
      </div>
      <div class="card-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    </div>
  `;

  l.querySelector(".edit-btn").addEventListener("click", () => {
    openEditTaskModal(k, isPage);
  });

  l.querySelector(".delete-btn").addEventListener("click", () => {
    l.classList.add("task-deleting");
    setTimeout(() => {
      const i = t.findIndex(o => o.id === k.id);
      if (i !== -1) {
        t.splice(i, 1);
        saveTasks();
        notifyUpdate();
      }
      if (isPage) {
        renderAllTasksPage(e ? e.value : "");
      } else {
        renderTasks(e ? e.value : "");
      }
    }, 300);
  });

  return l;
}

function checkEmpty(cn, catName) {
  if (cn.children.length === 0) {
    const eb = document.createElement("div");
    eb.className = "empty-col-box";
    eb.innerHTML = `
      <p>📭 Դատարկ է</p>
      <button class="add-empty-btn">+ Ավելացնել Task</button>
    `;
    eb.querySelector(".add-empty-btn").addEventListener("click", () => {
      openCreateTaskModal(catName, false);
    });
    cn.append(eb);
  }
}

function buildMemberCheckboxes(selectedIds) {
  const isAll = selectedIds === "all";
  let html = `
    <div id="mCheckList" style="max-height: 140px; overflow-y: auto; background: var(--input-bg); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; margin: 6px 0 14px 0; display: flex; flex-direction: column; gap: 8px;">
      <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13.5px; color: #38bdf8; font-weight: 600;">
        <input type="checkbox" id="chkAll" value="all" ${isAll ? 'checked' : ''} style="width: auto; margin: 0;">
        👥 Բոլորին (All)
      </label>
  `;

  for (const x of m) {
    const isChecked = !isAll && hasMember(selectedIds, x.id);
    html += `
      <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13.5px; color: var(--text-main);">
        <input type="checkbox" class="chk-member" value="${x.id}" ${isChecked ? 'checked' : ''} ${isAll ? 'disabled' : ''} style="width: auto; margin: 0;">
        ${x.name} (${x.role})
      </label>
    `;
  }

  html += `</div>`;
  return html;
}

function bindCheckboxLogic() {
  const chkAll = document.getElementById("chkAll");
  const mChks = document.querySelectorAll(".chk-member");

  chkAll.addEventListener("change", () => {
    for (const c of mChks) {
      c.disabled = chkAll.checked;
      if (chkAll.checked) c.checked = false;
    }
  });
}

function getSelectedMemberIds() {
  const chkAll = document.getElementById("chkAll");
  if (chkAll && chkAll.checked) return "all";

  const res = [];
  const mChks = document.querySelectorAll(".chk-member");
  for (const c of mChks) {
    if (c.checked) {
      res.push(Number(c.value));
    }
  }
  return res.length > 0 ? res : "all";
}

export function openCreateTaskModal(dc = "Design", isPage = false) {
  openModal(`
    <h3 style="margin-bottom: 12px; color: var(--text-main);">Ստեղծել նոր Task</h3>
    <label style="font-size: 12px; color: var(--text-muted);">Վերնագիր</label>
    <input type="text" id="ntTitle" placeholder="Վերնագիր...">
    <label style="font-size: 12px; color: var(--text-muted);">Նկարագրություն</label>
    <textarea id="ntDesc" placeholder="Նկարագրություն..." style="height: 75px; resize: none;"></textarea>
    <label style="font-size: 12px; color: var(--text-muted);">Բաժին (Category)</label>
    <select id="ntCat">
      <option value="Design" ${dc === "Design" ? "selected" : ""}>Design</option>
      <option value="Programming" ${dc === "Programming" ? "selected" : ""}>Programming</option>
      <option value="QA" ${dc === "QA" ? "selected" : ""}>QA</option>
    </select>
    <label style="font-size: 12px; color: var(--text-muted);">Օր (1-30)</label>
    <input type="number" id="ntDay" min="1" max="30" value="1">
    <label style="font-size: 12px; color: var(--text-muted);">Ընտրել անդամներին (1, 2, 3, 4... կամ All)</label>
    ${buildMemberCheckboxes([])}
    <button id="saveNtBtn" style="padding:10px 18px; background:linear-gradient(135deg, #38bdf8, #8b5cf6); border:none; border-radius:10px; font-weight:600; color:#fff; cursor:pointer; width:100%;">Ավելացնել</button>
  `);

  bindCheckboxLogic();

  document.getElementById("saveNtBtn").addEventListener("click", () => {
    const ti = document.getElementById("ntTitle").value;
    const de = document.getElementById("ntDesc").value;
    const ca = document.getElementById("ntCat").value;
    const dy = Number(document.getElementById("ntDay").value) || 1;
    const mids = getSelectedMemberIds();

    if (ti.trim() !== "") {
      t.push({
        id: Date.now(),
        title: ti,
        description: de,
        category: ca,
        memberIds: mids,
        day: dy
      });
      saveTasks();
      closeModal();
      notifyUpdate();
      if (isPage) {
        renderAllTasksPage(e ? e.value : "");
      } else {
        renderTasks(e ? e.value : "");
      }
    }
  });
}

function openEditTaskModal(tk, isPage = false) {
  openModal(`
    <h3 style="margin-bottom: 12px; color: var(--text-main);">Խմբագրել Task-ը</h3>
    <label style="font-size: 12px; color: var(--text-muted);">Վերնագիր</label>
    <input type="text" id="etTitle" value="${tk.title}">
    <label style="font-size: 12px; color: var(--text-muted);">Նկարագրություն</label>
    <textarea id="etDesc" style="height: 75px; resize: none;">${tk.description || ''}</textarea>
    <label style="font-size: 12px; color: var(--text-muted);">Բաժին (Category)</label>
    <select id="etCat">
      <option value="Design" ${tk.category === "Design" ? "selected" : ""}>Design</option>
      <option value="Programming" ${tk.category === "Programming" ? "selected" : ""}>Programming</option>
      <option value="QA" ${tk.category === "QA" ? "selected" : ""}>QA</option>
    </select>
    <label style="font-size: 12px; color: var(--text-muted);">Օր (1-30)</label>
    <input type="number" id="etDay" min="1" max="30" value="${tk.day || 1}">
    <label style="font-size: 12px; color: var(--text-muted);">Ընտրել անդամներին (1, 2, 3, 4... կամ All)</label>
    ${buildMemberCheckboxes(tk.memberIds)}
    <button id="upTkBtn" style="padding:10px 18px; background:#38bdf8; border:none; border-radius:10px; font-weight:600; color:#0f172a; cursor:pointer; width:100%;">Պահպանել</button>
  `);

  bindCheckboxLogic();

  document.getElementById("upTkBtn").addEventListener("click", () => {
    const ti = document.getElementById("etTitle").value;
    const de = document.getElementById("etDesc").value;
    const ca = document.getElementById("etCat").value;
    const dy = Number(document.getElementById("etDay").value) || 1;
    const mids = getSelectedMemberIds();

    if (ti.trim() !== "") {
      tk.title = ti;
      tk.description = de;
      tk.category = ca;
      tk.day = dy;
      tk.memberIds = mids;
      saveTasks();
      closeModal();
      notifyUpdate();
      if (isPage) {
        renderAllTasksPage(e ? e.value : "");
      } else {
        renderTasks(e ? e.value : "");
      }
    }
  });
}