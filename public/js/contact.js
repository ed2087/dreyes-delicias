/* ============================================
   CONTACT PAGE SCRIPT
   Purpose: Contact form submission
   ============================================ */

(function initContact() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('contactSubmitBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('contactName').value.trim();
    const email   = document.getElementById('contactEmail').value.trim();
    const phone   = document.getElementById('contactPhone').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) {
      showToast('Por favor completa los campos requeridos', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '...';

    try {
      await fetchAPI('/contact', {
        method: 'POST',
        body: { name, email, phone, subject, message }
      });

      showToast('¡Mensaje enviado! Te contactaremos pronto.', 'success', 5000);
      form.reset();
    } catch (error) {
      showToast(error.message || 'Error al enviar. Intenta de nuevo.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar mensaje';
    }
  });
})();
