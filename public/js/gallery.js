/* ============================================
   GALLERY PAGE SCRIPT
   Purpose: Lightbox with swipe support
   ============================================ */

(function initGallery() {
  const items     = Array.from(document.querySelectorAll('.gallery-masonry-item'));
  const backdrop  = document.getElementById('lightboxBackdrop');
  const lightImg  = document.getElementById('lightboxImg');
  const closeBtn  = document.getElementById('lightboxClose');
  const prevBtn   = document.getElementById('lightboxPrev');
  const nextBtn   = document.getElementById('lightboxNext');

  if (!backdrop || items.length === 0) return;

  let currentIdx = 0;
  let startX = 0;

  function openLightbox(index) {
    currentIdx = index;
    lightImg.src = items[index].dataset.url;
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    lightImg.src = '';
  }

  function showNext() {
    currentIdx = (currentIdx + 1) % items.length;
    lightImg.src = items[currentIdx].dataset.url;
  }

  function showPrev() {
    currentIdx = (currentIdx - 1 + items.length) % items.length;
    lightImg.src = items[currentIdx].dataset.url;
  }

  // Open on item click
  items.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  // Close
  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeLightbox();
  });

  // Navigation
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!backdrop.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft')  showPrev();
  });

  // Touch swipe
  backdrop.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  backdrop.addEventListener('touchend', (e) => {
    const deltaX = e.changedTouches[0].clientX - startX;
    if (Math.abs(deltaX) > 50) {
      deltaX < 0 ? showNext() : showPrev();
    }
  }, { passive: true });
})();
