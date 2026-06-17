/* ============================================
   ADMIN ALLY FORM
   ============================================ */

(function initAdminAllyForm() {
  const form        = document.getElementById('allyForm');
  const saveBtn     = document.getElementById('saveBtn');
  const activeChk   = document.getElementById('activeToggle');
  const activeLabel = document.getElementById('activeLabel');

  if (!form) return;

  // Live image preview
  const imageInput   = document.getElementById('imageInput');
  const previewWrap  = document.getElementById('imagePreviewWrap');
  const previewImg   = document.getElementById('imagePreview');
  if (imageInput && previewWrap && previewImg) {
    imageInput.addEventListener('change', function() {
      const file = imageInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        previewImg.src = e.target.result;
        previewWrap.style.display = '';
      };
      reader.readAsDataURL(file);
    });
  }

  if (activeChk && activeLabel) {
    activeChk.addEventListener('change', function() {
      activeLabel.textContent = activeChk.checked
        ? '✅ Activo — visible en el sitio'
        : '⏸️ Inactivo — oculto';
    });
  }

  const featuredChk   = document.getElementById('featuredToggle');
  const featuredLabel = document.getElementById('featuredLabel');
  if (featuredChk && featuredLabel) {
    featuredChk.addEventListener('change', function() {
      featuredLabel.textContent = featuredChk.checked
        ? '⭐ Destacado — aparece en el inicio'
        : '○ Normal — solo en /negocios';
    });
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    saveBtn.disabled    = true;
    saveBtn.textContent = 'Guardando…';

    const idInput  = form.querySelector('[name="_id"]');
    const isEdit   = !!idInput;
    const id       = isEdit ? idInput.value : null;
    const endpoint = isEdit ? '/allies/' + id : '/allies';
    const method   = isEdit ? 'PUT' : 'POST';

    const formData = new FormData(form);
    if (!activeChk.checked) formData.set('active', 'false');
    if (featuredChk && !featuredChk.checked) formData.set('featured', 'false');

    try {
      const data = await fetchAPI(endpoint, {
        method,
        body: formData,
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });
      if (!data.success) throw new Error(data.message || 'Error');
      adminToast(isEdit ? 'Colaborador actualizado' : 'Colaborador creado', 'success');
      setTimeout(() => { window.location.href = '/admin/allies'; }, 900);
    } catch (err) {
      adminToast(err.message || 'Error al guardar', 'error');
      saveBtn.disabled    = false;
      saveBtn.textContent = isEdit ? 'Guardar cambios' : 'Crear colaborador';
    }
  });

})();
