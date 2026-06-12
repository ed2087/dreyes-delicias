/* ============================================
   ADMIN HOURS FORM
   ============================================ */

(function initAdminHours() {
  const form    = document.getElementById('hoursForm');
  const saveBtn = document.getElementById('saveHoursBtn');
  if (!form) return;

  // Toggle: enable/disable time selects and dim the row
  document.querySelectorAll('[data-day-toggle]').forEach(function(toggle) {
    const day = toggle.dataset.dayToggle;

    function sync() {
      const active = toggle.checked;
      const row = document.getElementById('dayRow-' + day);
      if (row) row.classList.toggle('day-inactive', !active);
      document.querySelectorAll(`select[data-day="${day}"]`).forEach(function(sel) {
        sel.disabled = !active;
      });
    }

    sync();
    toggle.addEventListener('change', sync);
  });

  // Save
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    saveBtn.disabled = true;
    saveBtn.textContent = 'Guardando...';

    const hours = {};
    ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'].forEach(function(day) {
      const toggle   = document.querySelector(`[data-day-toggle="${day}"]`);
      const openSel  = document.querySelector(`select[name="hours[${day}][open]"]`);
      const closeSel = document.querySelector(`select[name="hours[${day}][close]"]`);
      hours[day] = {
        active: toggle  ? toggle.checked   : false,
        open:   openSel ? openSel.value    : '4:00 PM',
        close:  closeSel ? closeSel.value  : '10:00 PM'
      };
    });

    try {
      await fetchAPI('/location', { method: 'PUT', body: { hours } });
      adminToast('Horario guardado', 'success');
    } catch (err) {
      adminToast(err.message || 'Error al guardar', 'error');
    }

    saveBtn.disabled = false;
    saveBtn.textContent = 'Guardar horario';
  });
})();
