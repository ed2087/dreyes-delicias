/* ============================================
   ADMIN GALLERY SCRIPT
   Purpose: Upload, album filter, toggle featured, delete
   ============================================ */

(function initAdminGallery() {
  const uploadZone     = document.getElementById('uploadZone');
  const uploadInput    = document.getElementById('uploadInput');
  const uploadControls = document.getElementById('uploadControls');
  const uploadPreview  = document.getElementById('uploadPreviewGrid');
  const uploadSubmit   = document.getElementById('uploadSubmitBtn');
  const uploadCancel   = document.getElementById('uploadCancelBtn');
  const uploadAlbum    = document.getElementById('uploadAlbum');
  const grid           = document.getElementById('galleryAdminGrid');

  let selectedFiles = [];

  // ── Upload zone ──────────────────────────────────────────────────────────────
  if (uploadZone) {
    uploadZone.addEventListener('click', () => uploadInput.click());

    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      handleFiles(Array.from(e.dataTransfer.files));
    });
  }

  if (uploadInput) {
    uploadInput.addEventListener('change', () => {
      handleFiles(Array.from(uploadInput.files));
    });
  }

  function handleFiles(files) {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    selectedFiles = imageFiles.slice(0, 20);
    renderPreviews();
    if (uploadControls) uploadControls.style.display = 'block';
  }

  function renderPreviews() {
    if (!uploadPreview) return;
    uploadPreview.innerHTML = '';
    selectedFiles.forEach((file, i) => {
      const item = document.createElement('div');
      item.className = 'upload-preview-item';

      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.alt = file.name;

      const removeBtn = document.createElement('div');
      removeBtn.className = 'upload-preview-remove';
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', () => {
        selectedFiles.splice(i, 1);
        renderPreviews();
        if (selectedFiles.length === 0 && uploadControls) {
          uploadControls.style.display = 'none';
        }
      });

      item.appendChild(img);
      item.appendChild(removeBtn);
      uploadPreview.appendChild(item);
    });
  }

  // ── Submit upload ─────────────────────────────────────────────────────────────
  if (uploadSubmit) {
    uploadSubmit.addEventListener('click', async () => {
      if (selectedFiles.length === 0) return;

      const album = uploadAlbum ? uploadAlbum.value : 'food';
      const formData = new FormData();
      selectedFiles.forEach(file => formData.append('photos', file));
      formData.append('album', album);

      uploadSubmit.disabled = true;
      uploadSubmit.textContent = 'Subiendo...';

      try {
        await fetchAPI('/gallery', {
          method: 'POST',
          body: formData,
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        adminToast('Fotos subidas con éxito', 'success');
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        adminToast(error.message || 'Error al subir fotos', 'error');
        uploadSubmit.disabled = false;
        uploadSubmit.textContent = 'Subir fotos';
      }
    });
  }

  if (uploadCancel) {
    uploadCancel.addEventListener('click', () => {
      selectedFiles = [];
      if (uploadPreview) uploadPreview.innerHTML = '';
      if (uploadControls) uploadControls.style.display = 'none';
    });
  }

  // ── Album filter ──────────────────────────────────────────────────────────────
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      if (!grid) return;

      grid.querySelectorAll('.gallery-admin-item').forEach(item => {
        if (filter === 'all' || item.dataset.album === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ── Toggle featured ───────────────────────────────────────────────────────────
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-toggle-featured');
    if (!btn) return;

    const id       = btn.dataset.id;
    const featured = btn.dataset.featured === 'true';

    try {
      await fetchAPI(`/gallery/${id}`, {
        method: 'PUT',
        body: { featured: String(!featured) }
      });

      btn.dataset.featured = String(!featured);
      btn.textContent = !featured ? '★ Quitar' : '☆ Destacar';

      const card = btn.closest('.gallery-admin-item');
      const badge = card.querySelector('.featured-badge');
      if (!featured) {
        if (!badge) {
          const b = document.createElement('span');
          b.className = 'featured-badge';
          b.textContent = '⭐ Destacada';
          card.querySelector('img').insertAdjacentElement('afterend', b);
        }
      } else {
        if (badge) badge.remove();
      }

      adminToast(!featured ? 'Marcada como destacada' : 'Quitada de destacadas');
    } catch (error) {
      adminToast('Error al actualizar', 'error');
    }
  });

  // ── Change album ──────────────────────────────────────────────────────────────
  document.addEventListener('change', async (e) => {
    const select = e.target.closest('select[data-id]');
    if (!select) return;

    const id    = select.dataset.id;
    const album = select.value;

    try {
      await fetchAPI(`/gallery/${id}`, { method: 'PUT', body: { album } });
      const item = select.closest('.gallery-admin-item');
      if (item) item.dataset.album = album;
      adminToast('Álbum actualizado');
    } catch (error) {
      adminToast('Error al actualizar álbum', 'error');
    }
  });

  // ── Delete photo ──────────────────────────────────────────────────────────────
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-delete-photo');
    if (!btn) return;

    const ok = await adminConfirm('¿Eliminar esta foto permanentemente?', { icon: '🖼️', title: 'Eliminar foto' });
    if (!ok) return;

    const id = btn.dataset.id;

    try {
      await fetchAPI(`/gallery/${id}`, { method: 'DELETE' });
      const item = btn.closest('.gallery-admin-item');
      if (item) item.remove();
      adminToast('Foto eliminada');
    } catch (error) {
      adminToast('Error al eliminar', 'error');
    }
  });
})();
