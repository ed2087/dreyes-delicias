(function () {
  var hero   = document.querySelector('.sd-hero');
  var slides = document.querySelectorAll('.sd-slide');
  if (!slides.length || slides.length <= 1) return;

  var dots    = document.querySelectorAll('.sd-dot');
  var prev    = document.getElementById('sdPrev');
  var next    = document.getElementById('sdNext');
  var current = 0;
  var timer   = null;
  var DELAY   = 5000;

  function goTo(idx) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');

    current = (idx + slides.length) % slides.length;

    // Force Ken Burns to restart when revisiting a slide
    var img = slides[current].querySelector('img');
    if (img) {
      img.style.animation = 'none';
      void img.offsetWidth;
      img.style.animation = '';
    }

    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(function () { goTo(current + 1); }, DELAY);
  }

  function stopTimer() {
    clearInterval(timer);
    timer = null;
  }

  // Arrow clicks — reset timer so we don't skip too fast after manual nav
  if (prev) prev.addEventListener('click', function () { stopTimer(); goTo(current - 1); startTimer(); });
  if (next) next.addEventListener('click', function () { stopTimer(); goTo(current + 1); startTimer(); });

  dots.forEach(function (d) {
    d.addEventListener('click', function () {
      stopTimer();
      goTo(parseInt(d.dataset.idx, 10));
      startTimer();
    });
  });

  // Pause on hover so user can read
  if (hero) {
    hero.addEventListener('mouseenter', stopTimer);
    hero.addEventListener('mouseleave', startTimer);
  }

  // Touch swipe
  var startX = 0;
  (hero || slides[0]).addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
  }, { passive: true });
  (hero || slides[0]).addEventListener('touchend', function (e) {
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) {
      stopTimer();
      goTo(diff > 0 ? current + 1 : current - 1);
      startTimer();
    }
  });

  startTimer();
})();
