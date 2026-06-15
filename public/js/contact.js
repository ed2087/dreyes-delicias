/* ============================================
   CONTACT PAGE SCRIPT
   Purpose: Contact form submission + slide-to-verify + honeypot
   ============================================ */

(function initContact() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('contactSubmitBtn');
  const lang      = document.documentElement.lang || 'es';

  if (!form) return;

  /* ── Slide-to-verify ─────────────────────────────────────────────────────── */
  let slideVerified = false;

  const slideWrap  = document.getElementById('slideVerify');
  const slideThumb = document.getElementById('slideThumb');
  const slideFill  = document.getElementById('slideFill');

  // Start with submit locked
  submitBtn.disabled = true;

  if (slideWrap && slideThumb && slideFill) {
    const SNAP_PCT    = 0.82;
    let dragging      = false;
    let dragOffsetX   = 0;

    function maxX() {
      return slideWrap.offsetWidth - slideThumb.offsetWidth;
    }

    function setPos(px) {
      const m = maxX();
      px = Math.max(0, Math.min(px, m));
      slideThumb.style.left = px + 'px';
      slideFill.style.width = px + 'px';
      return m > 0 ? px / m : 0;
    }

    function snapToEnd() {
      slideVerified = true;
      const m = maxX();
      slideThumb.style.transition = 'left 0.25s ease';
      slideThumb.style.left = m + 'px';
      slideFill.style.width = m + 'px';
      setTimeout(function () { slideThumb.style.transition = ''; }, 280);
      slideWrap.classList.remove('dragging');
      slideWrap.classList.add('verified');
      submitBtn.disabled = false;
    }

    function snapBack() {
      dragging = false;
      slideWrap.classList.remove('dragging');
      slideThumb.style.transition = 'left 0.3s cubic-bezier(0.25,0.46,0.45,0.94)';
      slideThumb.style.left = '0px';
      slideFill.style.width = '0px';
      setTimeout(function () { slideThumb.style.transition = ''; }, 320);
    }

    function resetSlider() {
      slideVerified = false;
      dragging = false;
      slideWrap.classList.remove('verified', 'dragging');
      slideThumb.style.transition = '';
      slideThumb.style.left = '0px';
      slideFill.style.width = '0px';
      submitBtn.disabled = true;
    }

    // Mouse events
    slideThumb.addEventListener('mousedown', function (e) {
      if (slideVerified) return;
      dragging = true;
      dragOffsetX = e.clientX - slideThumb.getBoundingClientRect().left;
      slideWrap.classList.add('dragging');
      e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      var wrapLeft = slideWrap.getBoundingClientRect().left;
      var newLeft  = e.clientX - wrapLeft - dragOffsetX;
      var pct      = setPos(newLeft);
      if (pct >= SNAP_PCT) { dragging = false; snapToEnd(); }
    });

    document.addEventListener('mouseup', function () {
      if (!dragging) return;
      snapBack();
    });

    // Touch events
    slideThumb.addEventListener('touchstart', function (e) {
      if (slideVerified) return;
      dragging = true;
      dragOffsetX = e.touches[0].clientX - slideThumb.getBoundingClientRect().left;
      slideWrap.classList.add('dragging');
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      var wrapLeft = slideWrap.getBoundingClientRect().left;
      var newLeft  = e.touches[0].clientX - wrapLeft - dragOffsetX;
      var pct      = setPos(newLeft);
      if (pct >= SNAP_PCT) { dragging = false; snapToEnd(); }
    }, { passive: false });

    document.addEventListener('touchend', function () {
      if (!dragging) return;
      snapBack();
    });

    // Expose reset for post-submit
    slideWrap._reset = resetSlider;
  }

  /* ── Form submit ─────────────────────────────────────────────────────────── */
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!slideVerified) {
      showToast(
        lang === 'es' ? 'Desliza para verificar primero' : 'Please slide to verify first',
        'error'
      );
      return;
    }

    var name    = document.getElementById('contactName').value.trim();
    var email   = document.getElementById('contactEmail').value.trim();
    var phone   = document.getElementById('contactPhone').value.trim();
    var subject = document.getElementById('contactSubject').value.trim();
    var message = document.getElementById('contactMessage').value.trim();
    var honeypot = (form.querySelector('[name="website"]') || {}).value || '';

    if (!name || !email || !message) {
      showToast(
        lang === 'es' ? 'Por favor completa los campos requeridos' : 'Please fill in the required fields',
        'error'
      );
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = lang === 'es' ? 'Enviando...' : 'Sending...';

    try {
      await fetchAPI('/contact', {
        method: 'POST',
        body: { name, email, phone, subject, message, website: honeypot }
      });

      showToast(
        lang === 'es' ? '¡Mensaje enviado! Te contactaremos pronto.' : 'Message sent! We\'ll be in touch soon.',
        'success',
        5000
      );
      form.reset();
      if (slideWrap && slideWrap._reset) slideWrap._reset();
    } catch (err) {
      showToast(
        err.message || (lang === 'es' ? 'Error al enviar. Intenta de nuevo.' : 'Error sending. Please try again.'),
        'error'
      );
      // Keep slider state; re-enable submit so they can retry
      if (slideVerified) submitBtn.disabled = false;
    } finally {
      submitBtn.textContent = lang === 'es' ? 'Enviar mensaje' : 'Send message';
    }
  });
})();
