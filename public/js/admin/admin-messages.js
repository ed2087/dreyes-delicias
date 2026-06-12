/* ============================================
   ADMIN MESSAGES SCRIPT
   ============================================ */

(function initAdminMessages() {

  // Mark as read
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-mark-read');
    if (!btn) return;

    const id   = btn.dataset.id;
    const card = btn.closest('.message-card');

    try {
      await fetchAPI(`/messages/${id}`, { method: 'PUT' });
      if (card) {
        card.classList.remove('unread');
        card.querySelector('.unread-dot')?.remove();
      }
      btn.remove();

      // Update unread count in sidebar badge
      const badge = document.querySelector('.messages-badge');
      if (badge) {
        const count = parseInt(badge.textContent, 10) - 1;
        if (count <= 0) badge.remove();
        else badge.textContent = count;
      }

      adminToast('Marcado como leído');
    } catch (error) {
      adminToast('Error al actualizar', 'error');
    }
  });

  // Delete message
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-delete-message');
    if (!btn) return;

    const id   = btn.dataset.id;
    const name = btn.dataset.name || 'este mensaje';

    const ok = await adminConfirm(`¿Eliminar mensaje de "${name}"?`);
    if (!ok) return;

    const card = btn.closest('.message-card');

    try {
      await fetchAPI(`/messages/${id}`, { method: 'DELETE' });
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(-10px)';
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        setTimeout(() => card.remove(), 300);
      }
      adminToast('Mensaje eliminado');
    } catch (error) {
      adminToast('Error al eliminar', 'error');
    }
  });
})();
