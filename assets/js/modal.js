const m = document.getElementById('m');
const mo = document.getElementById('mo');
const cl = document.getElementById('cl');

export function openModal(x) {
  if (mo && m) {
    mo.innerHTML = x;
    m.classList.remove('hidden');
  }
}

export function closeModal() {
  if (m && mo) {
    m.classList.add('hidden');
    mo.innerHTML = '';
  }
}

if (cl) {
  cl.addEventListener('click', closeModal);
}

if (m) {
  window.addEventListener('click', (e) => {
    if (e.target === m) {
      closeModal();
    }
  });
}