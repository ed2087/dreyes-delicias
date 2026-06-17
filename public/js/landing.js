/* ============================================
   LANDING PAGE SCRIPT
   ============================================ */

(function initLanding() {
  // Hero background fade-in
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    const img = new Image();
    img.src = 'https://res.cloudinary.com/dwlib8nke/image/upload/v1781203534/tacotruck_wbao4x.webp';
    img.onload = () => heroBg.classList.add('loaded');
    img.onerror = () => {};
  }
})();

/* ── Featured Partner Rotation ─────────────────────────────────────────────── */
(function initAllySpotlight() {
  const stage = document.getElementById('allyStage');
  const dotsEl = document.getElementById('allyDots');
  if (!stage) return;

  const cards = Array.from(stage.querySelectorAll('.ally-card'));
  const dots  = dotsEl ? Array.from(dotsEl.querySelectorAll('.ally-dot')) : [];
  if (cards.length < 2) return;

  let current = 0;
  let timer   = null;
  const DELAY = 7000;

  function goTo(next) {
    if (next === current) return;

    const prev = current;
    cards[prev].classList.remove('active');
    cards[prev].classList.add('exit');
    dots[prev] && dots[prev].classList.remove('active');

    setTimeout(function() {
      cards[prev].classList.remove('exit');
    }, 650);

    current = next;
    cards[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  function advance() { goTo((current + 1) % cards.length); }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(advance, DELAY);
  }

  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() { goTo(i); startTimer(); });
  });

  stage.addEventListener('mouseenter', function() { clearInterval(timer); });
  stage.addEventListener('mouseleave', startTimer);

  startTimer();
})();

/* ── Menu Slider ────────────────────────────────────────────────────────────── */
(function initMenuSlider() {
  var track   = document.getElementById('menuCardsScroll');
  var wrapper = document.getElementById('mcsWrapper');
  var prevBtn = document.getElementById('mcsArrowPrev');
  var nextBtn = document.getElementById('mcsArrowNext');
  var bar     = document.getElementById('mcsProgressBar');

  if (!track) return;

  var cards = Array.from(track.querySelectorAll('.menu-card-preview'));
  if (cards.length === 0) return;

  function cardStep() {
    var gap = parseInt(window.getComputedStyle(track).columnGap) || 16;
    return (cards[0] ? cards[0].offsetWidth : 260) + gap;
  }

  function updateUI() {
    var max = track.scrollWidth - track.clientWidth;
    var pct = max > 0 ? (track.scrollLeft / max) * 100 : 100;

    if (bar) bar.style.width = pct + '%';

    var atStart = track.scrollLeft <= 2;
    var atEnd   = max <= 0 || track.scrollLeft >= max - 2;

    if (prevBtn) prevBtn.disabled = atStart;
    if (nextBtn) nextBtn.disabled = atEnd;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      track.scrollTo({ left: track.scrollLeft - cardStep(), behavior: 'smooth' });
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      track.scrollTo({ left: track.scrollLeft + cardStep(), behavior: 'smooth' });
    });
  }

  track.addEventListener('scroll', updateUI, { passive: true });
  window.addEventListener('resize', updateUI);

  /* Mouse drag ──────────────────────────────────────────────────────────────── */
  var dragStartX  = 0;
  var dragOriginL = 0;
  var dragging    = false;

  track.addEventListener('mousedown', function(e) {
    dragging    = true;
    dragStartX  = e.pageX;
    dragOriginL = track.scrollLeft;
  });

  document.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    track.scrollLeft = dragOriginL - (e.pageX - dragStartX);
  });

  document.addEventListener('mouseup', function() {
    if (!dragging) return;
    dragging = false;
    var step = cardStep();
    if (step > 0) {
      var nearest = Math.round(track.scrollLeft / step) * step;
      track.scrollTo({ left: nearest, behavior: 'smooth' });
    }
  });

  updateUI();
})();
