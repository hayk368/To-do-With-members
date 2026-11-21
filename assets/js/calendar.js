import { a as t } from './data.js';

const lol = document.querySelector(".lol");

export function renderCalendarPage(f = "") {
  if (!lol) return;

  lol.innerHTML = `
    <div style="width: 100%; display: flex; flex-direction: column; gap: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 style="font-size: 22px; color: var(--text-main);">📅 Օրացույց (Calendar)</h2>
        <span style="font-size: 14px; color: var(--text-muted);">Նոյեմբեր 2026</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; width: 100%;">
        ${renderDaysGrid(f)}
      </div>
    </div>
  `;
}

function renderDaysGrid(f) {
  let dh = "";
  const wd = ["Կիր", "Երկ", "Երք", "Չոր", "Հին", "Ուրբ", "Շաբ"];

  for (const w of wd) {
    dh += `<div style="text-align: center; font-weight: 700; color: #38bdf8; font-size: 13px; padding-bottom: 8px;">${w}</div>`;
  }

  for (let i = 1; i <= 30; i++) {
    const dt = t.filter(k => (k.day || 1) === i && (
      k.title.toLowerCase().includes(f.toLowerCase()) ||
      k.description.toLowerCase().includes(f.toLowerCase())
    ));

    let mh = "";
    for (const x of dt) {
      mh += `
        <div style="background: rgba(56, 189, 248, 0.15); border-left: 2px solid #38bdf8; padding: 4px 6px; border-radius: 4px; font-size: 11px; color: var(--text-main); margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${x.title}
        </div>
      `;
    }

    dh += `
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; min-height: 90px; padding: 10px; display: flex; flex-direction: column; gap: 4px;">
        <span style="font-size: 12px; font-weight: 700; color: var(--text-muted);">${i}</span>
        <div style="display: flex; flex-direction: column; gap: 2px; overflow-y: auto; max-height: 70px;">
          ${mh}
        </div>
      </div>
    `;
  }

  return dh;
}