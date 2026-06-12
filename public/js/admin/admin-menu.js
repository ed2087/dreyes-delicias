/* ============================================
   ADMIN MENU LIST SCRIPT
   Purpose: Delete menu items
   ============================================ */

(function initAdminMenu() {
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-delete-item');
    if (!btn) return;

    const id   = btn.dataset.id;
    const name = btn.dataset.name;

    const ok = await adminConfirm(`¿Eliminar el platillo "${name}"?`);
    if (!ok) return;

    try {
      await fetchAPI(`/menu/${id}`, { method: 'DELETE' });
      const row = btn.closest('tr');
      if (row) row.remove();
      adminToast('Platillo eliminado');
    } catch (error) {
      adminToast('Error al eliminar', 'error');
    }
  });
})();
