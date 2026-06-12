/* ============================================
   ADMIN MENU FORM SCRIPT
   Purpose: Create / edit menu item with image upload
   ============================================ */

(function initMenuForm() {
  const form        = document.getElementById('menuItemForm');
  const imageInput  = document.getElementById('imageInput');
  const selectBtn   = document.getElementById('selectImageBtn');
  const submitBtn   = document.getElementById('submitBtn');
  const itemId      = document.getElementById('itemId');
  const galInput    = document.getElementById('galleryInput');
  const addGalBtn   = document.getElementById('addGalleryBtn');
  const newPrev     = document.getElementById('newGalleryPreviews');

  if (!form) return;

  const isEdit   = !!itemId;
  const itemIdVal = itemId ? itemId.value : null;

  // Image preview
  if (selectBtn) {
    selectBtn.addEventListener('click', () => imageInput.click());
  }

  if (imageInput) {
    imageInput.addEventListener('change', () => {
      const file = imageInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = document.getElementById('imgPreview');
        const placeholder = document.getElementById('imgPlaceholder');
        let img = preview.querySelector('img');

        if (!img) {
          img = document.createElement('img');
          img.id = 'imgPreviewEl';
          img.alt = 'Preview';
          preview.innerHTML = '';
          preview.appendChild(img);
        }

        img.src = e.target.result;
        if (placeholder) placeholder.remove();
      };
      reader.readAsDataURL(file);
    });
  }

  // Spice level buttons
  var spiceInput = document.getElementById('spiceLevelInput');
  document.querySelectorAll('.spice-opt').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.spice-opt').forEach(function(b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      if (spiceInput) spiceInput.value = btn.dataset.val;
    });
  });

  // Gallery: accumulate multiple selections
  var galleryDT = new DataTransfer();

  if (addGalBtn) addGalBtn.addEventListener('click', function () { galInput.click(); });

  if (galInput) {
    galInput.addEventListener('change', function () {
      var newFiles = Array.from(galInput.files);
      if (!newFiles.length) return;
      newFiles.forEach(function (f) { galleryDT.items.add(f); });
      galInput.files = galleryDT.files;
      newPrev.style.display = 'grid';
      newFiles.forEach(function (f) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var div = document.createElement('div');
          div.className = 'gal-item';
          var img = document.createElement('img');
          img.src = e.target.result;
          div.appendChild(img);
          newPrev.appendChild(div);
        };
        reader.readAsDataURL(f);
      });
    });
  }

  // Gallery: delete existing photo
  var existingGallery = document.getElementById('existingGallery');
  if (existingGallery) {
    existingGallery.addEventListener('click', async function (e) {
      var btn = e.target.closest('.gal-del');
      if (!btn) return;
      var idx = parseInt(btn.dataset.idx);
      const ok = await adminConfirm('¿Eliminar esta foto?', { icon: '🖼️', title: 'Eliminar foto' });
      if (!ok) return;
      btn.disabled = true;
      try {
        await fetchAPI('/menu/' + itemIdVal + '/gallery/' + idx, { method: 'DELETE' });
        document.getElementById('galItem-' + idx)?.remove();
        existingGallery.querySelectorAll('.gal-del').forEach(function (b, i) {
          b.dataset.idx = i;
          b.closest('.gal-item').id = 'galItem-' + i;
        });
        adminToast('Foto eliminada', 'success');
      } catch (err) {
        adminToast(err.message || 'Error al eliminar', 'error');
        btn.disabled = false;
      }
    });
  }

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name_es = document.getElementById('nameEs').value.trim();
    const price   = document.getElementById('price').value;
    const category = document.getElementById('category').value;

    if (!name_es || !price || !category) {
      adminToast('Nombre, precio y categoría son requeridos', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';

    const formData = new FormData(form);

    // Set checkbox values correctly
    formData.set('featured',  document.getElementById('featuredToggle').checked  ? 'true' : 'false');
    formData.set('available', document.getElementById('availableToggle').checked ? 'true' : 'false');

    try {
      const endpoint = isEdit ? `/menu/${itemIdVal}` : '/menu';
      const method   = isEdit ? 'PUT' : 'POST';

      await fetchAPI(endpoint, {
        method,
        body: formData,
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });

      adminToast(isEdit ? 'Platillo actualizado' : 'Platillo agregado', 'success');
      setTimeout(() => { window.location.href = '/admin/menu'; }, 800);
    } catch (error) {
      adminToast(error.message || 'Error al guardar', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = isEdit ? 'Guardar cambios' : 'Agregar platillo';
    }
  });
})();
