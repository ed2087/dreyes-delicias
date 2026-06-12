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
