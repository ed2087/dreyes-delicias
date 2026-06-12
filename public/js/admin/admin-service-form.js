(function initServiceForm() {
  const form      = document.getElementById('serviceForm');
  const imgInput  = document.getElementById('imageInput');
  const selectBtn = document.getElementById('selectImageBtn');
  const submitBtn = document.getElementById('submitBtn');
  const itemIdEl  = document.getElementById('serviceId');
  const galInput  = document.getElementById('galleryInput');
  const addGalBtn = document.getElementById('addGalleryBtn');
  const newPrev   = document.getElementById('newGalleryPreviews');

  if (!form) return;

  const isEdit  = !!itemIdEl;
  const itemId  = itemIdEl ? itemIdEl.value : null;

  // Cover image preview
  if (selectBtn) selectBtn.addEventListener('click', function () { imgInput.click(); });
  if (imgInput) {
    imgInput.addEventListener('change', function () {
      const file = imgInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        const preview = document.getElementById('imgPreview');
        if (!preview) return;
        let img = preview.querySelector('img');
        if (!img) {
          img = document.createElement('img');
          img.alt = 'Preview';
          preview.innerHTML = '';
          preview.appendChild(img);
        }
        img.src = e.target.result;
        const ph = document.getElementById('imgPlaceholder');
        if (ph) ph.remove();
      };
      reader.readAsDataURL(file);
    });
  }

  // Gallery: open file picker
  if (addGalBtn) addGalBtn.addEventListener('click', function () { galInput.click(); });

  // Accumulate files across multiple selections
  var galleryDT = new DataTransfer();

  if (galInput) {
    galInput.addEventListener('change', function () {
      var newFiles = Array.from(galInput.files);
      if (!newFiles.length) return;

      // Add each newly picked file to the accumulated set
      newFiles.forEach(function (file) { galleryDT.items.add(file); });

      // Keep the input in sync so FormData picks up everything
      galInput.files = galleryDT.files;

      // Preview only the files just added (avoid re-rendering previous ones)
      newPrev.style.display = 'grid';
      newFiles.forEach(function (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var div = document.createElement('div');
          div.className = 'gal-item';
          var img = document.createElement('img');
          img.src = e.target.result;
          div.appendChild(img);
          newPrev.appendChild(div);
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // Gallery: delete existing photo
  const existingGallery = document.getElementById('existingGallery');
  if (existingGallery) {
    existingGallery.addEventListener('click', async function (e) {
      const btn = e.target.closest('.gal-del');
      if (!btn) return;
      const idx = parseInt(btn.dataset.idx);
      const ok = await adminConfirm('¿Eliminar esta foto de la galería?', { icon: '🖼️', title: 'Eliminar foto' });
      if (!ok) return;
      btn.disabled = true;
      try {
        await fetchAPI('/services/' + itemId + '/gallery/' + idx, { method: 'DELETE' });
        document.getElementById('galItem-' + idx)?.remove();
        // Re-index remaining delete buttons
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

  // ── Bold / Italic toolbar ──────────────────────────────────────────────────────
  document.querySelectorAll('.fmt-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var ta = document.getElementById(btn.dataset.target);
      if (!ta) return;
      var start = ta.selectionStart, end = ta.selectionEnd;
      var sel = ta.value.substring(start, end);
      var wrap = btn.dataset.fmt === 'bold' ? '**' : '_';
      ta.setRangeText(wrap + sel + wrap, start, end, 'select');
      ta.focus();
    });
  });

  // ── Menu items ──────────────────────────────────────────────────────────────
  var menuContainer = document.getElementById('menuItemsContainer');
  var addMenuBtn    = document.getElementById('addMenuItemBtn');

  function makeMenuRow(name, detail) {
    var div = document.createElement('div');
    div.className = 'repeating-row';
    var n = document.createElement('input');
    n.type = 'text'; n.className = 'admin-form-input';
    n.name = 'menuItemName'; n.value = name || '';
    n.placeholder = 'Nombre del ítem (Ej: Asada)';
    var d = document.createElement('input');
    d.type = 'text'; d.className = 'admin-form-input';
    d.name = 'menuItemDetail'; d.value = detail || '';
    d.placeholder = 'Descripción / guarniciones';
    var del = document.createElement('button');
    del.type = 'button'; del.className = 'row-del'; del.title = 'Eliminar fila';
    del.textContent = '×';
    div.appendChild(n); div.appendChild(d); div.appendChild(del);
    return div;
  }

  if (addMenuBtn && menuContainer) {
    addMenuBtn.addEventListener('click', function () {
      menuContainer.appendChild(makeMenuRow('', ''));
    });
    menuContainer.addEventListener('click', function (e) {
      var b = e.target.closest('.row-del');
      if (b) b.closest('.repeating-row').remove();
    });
  }

  // ── Pricing rows ────────────────────────────────────────────────────────────
  var pricingContainer = document.getElementById('pricingRowsContainer');
  var addPricingBtn    = document.getElementById('addPricingRowBtn');

  function makePricingRow(label, price) {
    var div = document.createElement('div');
    div.className = 'repeating-row';
    var l = document.createElement('input');
    l.type = 'text'; l.className = 'admin-form-input';
    l.name = 'pricingLabel'; l.value = label || '';
    l.placeholder = 'Ej: 50 personas';
    var p = document.createElement('input');
    p.type = 'text'; p.className = 'admin-form-input price-input';
    p.name = 'pricingPrice'; p.value = price || '';
    p.placeholder = 'Ej: $960';
    var del = document.createElement('button');
    del.type = 'button'; del.className = 'row-del'; del.title = 'Eliminar fila';
    del.textContent = '×';
    div.appendChild(l); div.appendChild(p); div.appendChild(del);
    return div;
  }

  if (addPricingBtn && pricingContainer) {
    addPricingBtn.addEventListener('click', function () {
      pricingContainer.appendChild(makePricingRow('', ''));
    });
    pricingContainer.addEventListener('click', function (e) {
      var b = e.target.closest('.row-del');
      if (b) b.closest('.repeating-row').remove();
    });
  }

  // Form submit
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name_es = document.getElementById('nameEs').value.trim();
    if (!name_es) {
      adminToast('El nombre en español es requerido', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';

    const formData = new FormData(form);
    formData.set('featured', document.getElementById('featuredToggle').checked ? 'true' : 'false');

    try {
      const endpoint = isEdit ? '/services/' + itemId : '/services';
      const method   = isEdit ? 'PUT' : 'POST';

      await fetchAPI(endpoint, {
        method,
        body: formData,
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });

      adminToast(isEdit ? 'Servicio actualizado' : 'Servicio agregado', 'success');
      setTimeout(function () { window.location.href = '/admin/services'; }, 800);
    } catch (error) {
      adminToast(error.message || 'Error al guardar', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = isEdit ? 'Guardar cambios' : 'Agregar servicio';
    }
  });
})();
