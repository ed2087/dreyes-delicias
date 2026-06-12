/* ============================================
   GLOBAL JS — D'Reyes Delicias
   ============================================ */

/* ── API Wrapper ─────────────────────────────────────────────────────────────── */

/**
 * Fetch API wrapper with automatic CSRF header and error handling
 * @param {string} endpoint
 * @param {Object} options
 * @returns {Promise<Object>}
 */
async function fetchAPI(endpoint, options = {}) {
  const defaults = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    credentials: 'include'
  };

  const config = { ...defaults, ...options };
  config.headers = { ...defaults.headers, ...(options.headers || {}) };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  if (config.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const response = await fetch(`/api${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

/* ── Toast Notifications ─────────────────────────────────────────────────────── */

/**
 * Show a toast notification
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 * @param {number} duration - ms
 */
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 280);
  }, duration);
}

/* ── Modal Helpers ───────────────────────────────────────────────────────────── */

/**
 * Open a modal by backdrop ID
 * @param {string} backdropId
 */
function openModal(backdropId) {
  const el = document.getElementById(backdropId);
  if (el) el.classList.add('open');
}

/**
 * Close a modal by backdrop ID
 * @param {string} backdropId
 */
function closeModal(backdropId) {
  const el = document.getElementById(backdropId);
  if (el) el.classList.remove('open');
}

/**
 * Show confirmation modal
 * @param {string} message
 * @param {Function} onConfirm
 * @param {string} title
 */
function showConfirm(message, onConfirm, title = 'Confirmar') {
  const modal = document.getElementById('confirmModalBackdrop');
  if (!modal) return;

  const titleEl  = modal.querySelector('#confirmModalTitle') || modal.querySelector('.modal-title');
  const msgEl    = modal.querySelector('#confirmMessage');
  const confirmBtn = modal.querySelector('#confirmBtn');

  if (titleEl) titleEl.textContent = title;
  if (msgEl)   msgEl.textContent   = message;

  const newBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

  newBtn.addEventListener('click', () => {
    onConfirm();
    closeModal('confirmModalBackdrop');
  });

  openModal('confirmModalBackdrop');
}

/* ── Scroll Reveal ───────────────────────────────────────────────────────────── */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ── Modal close via data-action ─────────────────────────────────────────────── */
document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-action="close-modal"]');
  if (target) {
    const modalId = target.dataset.modal;
    if (modalId) closeModal(modalId);
  }

  // Close modal on backdrop click
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('open');
  }
});

/* ── Escape key closes modals ────────────────────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
  }
});
