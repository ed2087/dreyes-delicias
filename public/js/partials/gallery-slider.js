/* ============================================
   GALLERY SLIDER PARTIAL SCRIPT
   Purpose: 3D card carousel for landing page
   ============================================ */

(function initGallerySlider() {
  const stage     = document.getElementById('sliderStage');
  const dotsWrap  = document.getElementById('sliderDots');
  const prevBtn   = document.getElementById('sliderPrev');
  const nextBtn   = document.getElementById('sliderNext');

  if (!stage) return;

  const cards = Array.from(stage.querySelectorAll('.slider-card'));
  if (cards.length === 0) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  let startX = 0;
  let isDragging = false;

  // Build dots
  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  function updateDots() {
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  /**
   * Get CSS transform string for a given offset from center
   * @param {number} offset - position relative to current (0 = center)
   */
  function getTransform(offset) {
    const isMobile = window.innerWidth < 768;
    const baseX  = isMobile ? 62 : 70;
    const scaleStep = 0.18;

    if (offset === 0) return 'translateX(0) rotateY(0deg) scale(1)';

    const absOffset = Math.abs(offset);
    const dir = offset > 0 ? 1 : -1;
    const xPct = dir * baseX * absOffset;
    const rotY = dir * -32 * Math.min(absOffset, 2);
    const scale = Math.max(0.4, 1 - scaleStep * absOffset);
    const opacity = absOffset > 2 ? 0 : 1 - absOffset * 0.18;

    return `translateX(${xPct}%) rotateY(${rotY}deg) scale(${scale})`;
  }

  function render() {
    cards.forEach((card, i) => {
      const offset = i - currentIndex;
      const absOffset = Math.abs(offset);

      card.dataset.pos = String(offset);
      card.style.transform = getTransform(offset);
      card.style.zIndex    = String(10 - absOffset);
      card.style.opacity   = absOffset > 2 ? '0' : String(1 - absOffset * 0.18);
      card.style.pointerEvents = absOffset > 2 ? 'none' : '';
    });

    updateDots();
  }

  function goTo(index) {
    currentIndex = ((index % cards.length) + cards.length) % cards.length;
    render();
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  // Click side cards to navigate
  stage.addEventListener('click', (e) => {
    const card = e.target.closest('.slider-card');
    if (!card) return;
    const offset = parseInt(card.dataset.pos || '0');
    if (offset > 0) next();
    else if (offset < 0) prev();
  });

  // Arrow buttons
  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  // Touch / swipe
  stage.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoplay();
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const deltaX = e.changedTouches[0].clientX - startX;
    if (Math.abs(deltaX) > 40) {
      deltaX < 0 ? next() : prev();
    }
    isDragging = false;
    startAutoplay();
  }, { passive: true });

  // Mouse drag
  stage.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
    stopAutoplay();
  });

  document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) > 60) {
      deltaX < 0 ? next() : prev();
    }
    isDragging = false;
    startAutoplay();
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  // Autoplay
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(next, 4000);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  stage.addEventListener('mouseenter', stopAutoplay);
  stage.addEventListener('mouseleave', startAutoplay);

  // Init
  buildDots();
  render();
  startAutoplay();
})();
