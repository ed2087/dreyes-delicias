/* ============================================
   ADMIN GLOBAL JS
   Purpose: Sidebar toggle, toast, shared utilities
   ============================================ */

/* ── API Wrapper (admin version) ─────────────────────────────────────────────── */
async function fetchAPI(endpoint, options = {}) {
  const defaults = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    credentials: 'include'
  };
  const config = { ...defaults, ...options };
  config.headers = { ...defaults.headers, ...(options.headers || {}) };

  if (config.body instanceof FormData) {
    delete config.headers['Content-Type'];
  } else if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`/api${endpoint}`, config);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error');
  return data;
}

/* ── Admin Toast ─────────────────────────────────────────────────────────────── */
function adminToast(message, type = 'success') {
  const container = document.getElementById('adminToastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `admin-toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

/* ── Admin Confirm Modal ─────────────────────────────────────────────────────── */
var _confirmResolve = null;

function _ensureConfirmModal() {
  if (document.getElementById('_adminConfirmBackdrop')) return;

  var backdrop = document.createElement('div');
  backdrop.id = '_adminConfirmBackdrop';
  backdrop.className = 'admin-confirm-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');

  var box      = document.createElement('div');  box.className = 'admin-confirm-box';
  var icon     = document.createElement('div');  icon.id = '_adminConfirmIcon'; icon.className = 'admin-confirm-icon';
  var title    = document.createElement('div');  title.id = '_adminConfirmTitle'; title.className = 'admin-confirm-title';
  var msg      = document.createElement('p');    msg.id = '_adminConfirmMsg'; msg.className = 'admin-confirm-msg';
  var btns     = document.createElement('div');  btns.className = 'admin-confirm-btns';
  var okBtn    = document.createElement('button'); okBtn.id = '_adminConfirmOk'; okBtn.className = 'admin-btn admin-btn-danger';
  var cancelBtn = document.createElement('button'); cancelBtn.className = 'admin-btn admin-btn-secondary'; cancelBtn.textContent = 'Cancelar';

  cancelBtn.addEventListener('click', function() { _resolveConfirm(false); });
  backdrop.addEventListener('click', function(e) { if (e.target === backdrop) _resolveConfirm(false); });

  btns.appendChild(okBtn);
  btns.appendChild(cancelBtn);
  box.appendChild(icon);
  box.appendChild(title);
  box.appendChild(msg);
  box.appendChild(btns);
  backdrop.appendChild(box);
  document.body.appendChild(backdrop);
}

function adminConfirm(message, opts) {
  opts = opts || {};
  _ensureConfirmModal();

  return new Promise(function(resolve) {
    _confirmResolve = resolve;

    document.getElementById('_adminConfirmIcon').textContent  = opts.icon  || '🗑️';
    document.getElementById('_adminConfirmTitle').textContent = opts.title || 'Confirmar acción';
    document.getElementById('_adminConfirmMsg').textContent   = message;

    var okBtn = document.getElementById('_adminConfirmOk');
    okBtn.textContent = opts.confirmLabel || 'Eliminar';
    okBtn.className   = 'admin-btn ' + (opts.danger === false ? 'admin-btn-primary' : 'admin-btn-danger');

    var fresh = okBtn.cloneNode(true);
    fresh.addEventListener('click', function() { _resolveConfirm(true); });
    okBtn.replaceWith(fresh);

    document.getElementById('_adminConfirmBackdrop').classList.add('open');
    fresh.focus();
  });
}

function _resolveConfirm(result) {
  var backdrop = document.getElementById('_adminConfirmBackdrop');
  if (backdrop) backdrop.classList.remove('open');
  if (_confirmResolve) {
    var fn = _confirmResolve;
    _confirmResolve = null;
    fn(result);
  }
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') _resolveConfirm(false);
});

/* ── Sidebar toggle ───────────────────────────────────────────────────────────── */
(function initSidebar() {
  const toggle  = document.getElementById('adminMenuToggle');
  const sidebar = document.getElementById('adminSidebar');
  const overlay = document.getElementById('adminOverlay');

  if (!toggle || !sidebar) return;

  function openSidebar() {
    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('show');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
  }

  toggle.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });

  if (overlay) overlay.addEventListener('click', closeSidebar);
})();
