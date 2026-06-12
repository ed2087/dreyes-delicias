/* ============================================
   ADMIN SERVICES LIST SCRIPT
   ============================================ */

(function initAdminServices() {
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-delete-service');
    if (!btn) return;

    const id   = btn.dataset.id;
    const name = btn.dataset.name;

    const ok = await adminConfirm(`¿Eliminar el servicio "${name}"?`);
    if (!ok) return;

    try {
      await fetchAPI(`/services/${id}`, { method: 'DELETE' });
      const row = btn.closest('tr');
      if (row) row.remove();
      adminToast('Servicio eliminado');
    } catch (error) {
      adminToast('Error al eliminar', 'error');
    }
  });
})();
