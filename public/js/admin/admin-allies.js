/* ============================================
   ADMIN ALLIES LIST
   ============================================ */

(function initAdminAllies() {

  document.querySelectorAll('[data-delete]').forEach(function(btn) {
    btn.addEventListener('click', async function() {
      const id   = btn.dataset.delete;
      const name = btn.dataset.name;
      const ok = await adminConfirm('¿Eliminar "' + name + '"?', {
        message: 'Este colaborador se eliminará permanentemente del sitio.',
        confirmText: 'Eliminar',
        type: 'danger'
      });
      if (!ok) return;

      try {
        await fetchAPI('/allies/' + id, { method: 'DELETE' });
        adminToast('Colaborador eliminado', 'success');
        btn.closest('tr').remove();
      } catch (err) {
        adminToast(err.message || 'Error al eliminar', 'error');
      }
    });
  });

})();
