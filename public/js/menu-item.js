/* ============================================
   MENU ITEM — Carousel + Lightbox
   ============================================ */

(function () {
  var images = (typeof MI_IMAGES !== 'undefined') ? MI_IMAGES : [];
  var current = 0;

  // ── Carousel ──────────────────────────────────────────────────────────────
  var slides = document.querySelectorAll('.mi-slide');
  var dots   = document.querySelectorAll('.mi-dot');

  function goTo(idx) {
    if (!slides.length) return;
    idx = (idx + slides.length) % slides.length;
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = idx;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  var prevBtn = document.getElementById('miPrev');
  var nextBtn = document.getElementById('miNext');
  if (prevBtn) prevBtn.addEventListener('click', function (e) { e.stopPropagation(); goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function (e) { e.stopPropagation(); goTo(current + 1); });

  dots.forEach(function (dot) {
    dot.addEventListener('click', function (e) {
      e.stopPropagation();
      goTo(parseInt(dot.dataset.idx));
    });
  });

  // Touch swipe
  var carousel = document.getElementById('miCarousel');
  if (carousel) {
    var touchX = 0;
    carousel.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
    }, { passive: true });
  }

  // ── Lightbox ──────────────────────────────────────────────────────────────
  if (!images.length) return;

  // Build overlay DOM
  var overlay = document.createElement('div');
  overlay.className = 'lb-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  var inner = document.createElement('div');
  inner.className = 'lb-inner';

  var img = document.createElement('img');
  img.className = 'lb-img';
  img.alt = '';

  var closeBtn = document.createElement('button');
  closeBtn.className = 'lb-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Cerrar');

  var counter = document.createElement('div');
  counter.className = 'lb-counter';

  inner.appendChild(img);
  overlay.appendChild(inner);
  overlay.appendChild(closeBtn);

  if (images.length > 1) {
    var lbPrev = document.createElement('button');
    lbPrev.className = 'lb-prev';
    lbPrev.innerHTML = '&#8249;';
    lbPrev.setAttribute('aria-label', 'Anterior');

    var lbNext = document.createElement('button');
    lbNext.className = 'lb-next';
    lbNext.innerHTML = '&#8250;';
    lbNext.setAttribute('aria-label', 'Siguiente');

    overlay.appendChild(lbPrev);
    overlay.appendChild(lbNext);
    overlay.appendChild(counter);

    lbPrev.addEventListener('click', function (e) { e.stopPropagation(); lbGoTo(lbCurrent - 1); });
    lbNext.addEventListener('click', function (e) { e.stopPropagation(); lbGoTo(lbCurrent + 1); });

    // Lightbox touch swipe
    var lbTouchX = 0;
    overlay.addEventListener('touchstart', function (e) { lbTouchX = e.touches[0].clientX; }, { passive: true });
    overlay.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - lbTouchX;
      if (Math.abs(dx) > 40) lbGoTo(dx < 0 ? lbCurrent + 1 : lbCurrent - 1);
    }, { passive: true });
  }

  document.body.appendChild(overlay);

  var lbCurrent = 0;

  function lbGoTo(idx) {
    lbCurrent = (idx + images.length) % images.length;
    img.src = images[lbCurrent];
    if (images.length > 1) counter.textContent = (lbCurrent + 1) + ' / ' + images.length;
  }

  function openLightbox(idx) {
    lbGoTo(idx);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Open on carousel click or zoom button
  var zoomBtn = document.getElementById('miZoom');
  if (zoomBtn) zoomBtn.addEventListener('click', function (e) { e.stopPropagation(); openLightbox(current); });
  if (carousel) carousel.addEventListener('click', function () { openLightbox(current); });

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeLightbox(); });

  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  lbGoTo(lbCurrent - 1);
    if (e.key === 'ArrowRight') lbGoTo(lbCurrent + 1);
  });
})();
