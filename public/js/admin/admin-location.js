/* ============================================
   ADMIN LOCATION SCRIPT
   ============================================ */

(function initAdminLocation() {
  const form       = document.getElementById('locationForm');
  const isOpenBtn  = document.getElementById('isOpenToggle');
  const isOpenLabel = document.getElementById('isOpenLabel');

  if (!form) return;

  // isOpen toggle label update
  if (isOpenBtn) {
    function updateLabel() {
      const open = isOpenBtn.checked;
      if (isOpenLabel) {
        isOpenLabel.textContent = open ? '🟢 Abierto ahora' : '🔴 Cerrado ahora';
      }
    }
    updateLabel();
    isOpenBtn.addEventListener('change', updateLabel);
  }

  // Day active toggles — enable/disable time inputs
  document.querySelectorAll('[data-day-toggle]').forEach(toggle => {
    const day = toggle.dataset.dayToggle;
    function syncDayInputs() {
      const active = toggle.checked;
      document.querySelectorAll(`[data-day="${day}"]`).forEach(input => {
        input.disabled = !active;
        input.closest('.day-row')?.classList.toggle('day-inactive', !active);
      });
    }
    syncDayInputs();
    toggle.addEventListener('change', syncDayInputs);
  });

  // Save
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';

    // Build payload from form fields
    const payload = {
      address:       document.getElementById('address')?.value.trim(),
      googleMapsUrl: document.getElementById('googleMapsUrl')?.value.trim(),
      embedUrl:      document.getElementById('embedUrl')?.value.trim(),
      note_es:       document.getElementById('noteEs')?.value.trim(),
      note_en:       document.getElementById('noteEn')?.value.trim(),
      isOpen:        document.getElementById('isOpenToggle')?.checked,
      hours: {}
    };

    ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'].forEach(day => {
      const activeEl = document.querySelector(`[data-day-toggle="${day}"]`);
      const openEl   = document.querySelector(`select[name="hours[${day}][open]"]`);
      const closeEl  = document.querySelector(`select[name="hours[${day}][close]"]`);
      payload.hours[day] = {
        active: activeEl ? activeEl.checked : false,
        open:   openEl   ? openEl.value   : '4:00 PM',
        close:  closeEl  ? closeEl.value  : '10:00 PM'
      };
    });

    try {
      await fetchAPI('/location', { method: 'PUT', body: payload });
      adminToast('Información actualizada', 'success');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Guardar cambios';
    } catch (error) {
      adminToast(error.message || 'Error al guardar', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Guardar cambios';
    }
  });
})();
