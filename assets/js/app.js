import { a as t, saveTasks } from './data.js';
import { b as m, saveMembers } from './members.js';
import { openModal, closeModal } from './modal.js';
import { renderTasks, openCreateTaskModal, renderAllTasksPage, setOnTasksUpdated } from './task.js';
import { renderCalendarPage } from './calendar.js';

const lol = document.querySelector(".lol");
const e = document.querySelector("input[placeholder='serch task']");
const nv = document.querySelectorAll(".nav a");

let cv = "home";

function hasMember(ids, targetId) {
  if (ids === "all") return true;
  if (!Array.isArray(ids)) return false;
  for (const id of ids) {
    if (String(id) === String(targetId)) return true;
  }
  return false;
}

function getMemberTasks(memberId, memberName) {
  const res = [];
  for (const tk of t) {
    if (
      hasMember(tk.memberIds, memberId) ||
      tk.memberName === memberName ||
      tk.assignedTo === memberName
    ) {
      res.push(tk);
    }
  }
  return res;
}

export function renderMembers(f = "") {
  cv = "members";
  if (!lol) return;

  lol.innerHTML = `
    <div class="todo"></div>
    <div class="tomo"></div>
    <div class="tomo"></div>
  `;

  const c = lol.querySelector(".todo");
  const d = lol.querySelectorAll(".tomo");

  const fm = m.filter(q =>
    q.name.toLowerCase().includes(f.toLowerCase()) ||
    q.role.toLowerCase().includes(f.toLowerCase())
  );

  for (const q of fm) {
    const r = document.createElement("div");
    r.className = "task-item-card";

    const mt = getMemberTasks(q.id, q.name);

    r.innerHTML = `
      <h3>👤 ${q.name}</h3>
      <p>${q.role}</p>
      <div class="member-tasks-box" style="margin-top: 10px; display: flex; flex-direction: column; gap: 6px;"></div>
      <button class="edit-member-btn" style="margin-top: 10px; padding: 6px 12px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px; font-weight: 600; cursor: pointer;">Edit Member</button>
    `;

    const box = r.querySelector(".member-tasks-box");
    if (mt.length === 0) {
      const emptyP = document.createElement("p");
      emptyP.style.cssText = "font-size: 12px; opacity: 0.7; margin: 0;";
      emptyP.textContent = "Task-եր դեռ չկան";
      box.append(emptyP);
    } else {
      for (const tk of mt) {
        const item = document.createElement("div");
        item.style.cssText = "padding: 6px 10px; background: rgba(56, 189, 248, 0.1); border-radius: 8px; font-size: 12.5px; display: flex; justify-content: space-between; gap: 8px;";
        item.innerHTML = `
          <span>📌 ${tk.title}</span>
          <span>Օր ${tk.day || 1}</span>
        `;
        box.append(item);
      }
    }

    r.querySelector(".edit-member-btn").addEventListener("click", () => {
      let st = mt.length === 0
        ? `<p style="font-size: 12px; color: #f87171; margin-top: 12px;">⚠️ Այս անդամը դեռ task չունի</p>`
        : `<p style="font-size: 12px; color: #38bdf8; margin-top: 12px;">✅ Ունի կցված task-եր (${mt.length})</p>`;

      openModal(`
        <h3 style="margin-bottom: 12px; color: var(--text-main);">Խմբագրել անդամին</h3>
        <label style="font-size: 12px; color: var(--text-muted);">Անուն</label>
        <input type="text" id="emName" value="${q.name}">
        <label style="font-size: 12px; color: var(--text-muted);">Պաշտոն / Դեր</label>
        <input type="text" id="emRole" value="${q.role}">
        ${st}
        <button id="saveMemBtn" style="padding:8px 16px; background:#38bdf8; border:none; border-radius:8px; font-weight:600; color:#0f172a; cursor:pointer; margin-top:12px;">Պահպանել</button>
      `);

      document.getElementById("saveMemBtn").addEventListener("click", () => {
        const on = q.name;
        const nn = document.getElementById("emName").value;
        const nr = document.getElementById("emRole").value;

        if (nn.trim() !== "") {
          q.name = nn;
          for (const tk of t) {
            if (tk.memberName === on) {
              tk.memberName = nn;
            }
          }
          saveTasks();
        }
        q.role = nr.trim() !== "" ? nr : q.role;
        saveMembers();
        closeModal();
        renderMembers(e ? e.value : "");
      });
    });

    if (q.location === "todo") {
      c.append(r);
    } else if (q.location === "tomo1" && d[0]) {
      d[0].append(r);
    } else if (q.location === "tomo2" && d[1]) {
      d[1].append(r);
    } else {
      c.append(r);
    }
  }
}

setOnTasksUpdated(() => {
  const qVal = e ? e.value : "";
  if (cv === "members") {
    renderMembers(qVal);
  } else if (cv === "tasks") {
    renderAllTasksPage(qVal);
  } else if (cv === "calendar") {
    renderCalendarPage(qVal);
  } else {
    renderTasks(qVal);
  }
});

if (nv.length > 0) {
  nv.forEach((l, idx) => {
    l.addEventListener("click", (s) => {
      s.preventDefault();
      const txt = l.textContent.toLowerCase();

      if (txt.includes("calendar") || txt.includes("օրացույց")) {
        cv = "calendar";
        renderCalendarPage();
      } else if (txt.includes("task") && !txt.includes("add") && !txt.includes("new")) {
        cv = "tasks";
        renderAllTasksPage();
      } else if (txt.includes("member")) {
        cv = "members";
        renderMembers();
      } else if (idx === 1 || txt.includes("add") || txt.includes("new")) {
        openCreateTaskModal();
      } else {
        cv = "home";
        renderTasks();
      }
    });
  });
}

if (e) {
  e.addEventListener("input", (s) => {
    if (cv === "home") {
      renderTasks(s.target.value);
    } else if (cv === "tasks") {
      renderAllTasksPage(s.target.value);
    } else if (cv === "calendar") {
      renderCalendarPage(s.target.value);
    } else if (cv === "members") {
      renderMembers(s.target.value);
    }
  });
}

renderTasks();