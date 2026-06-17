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

(function initDragSort() {
  const tbody = document.querySelector('.admin-table tbody');
  if (!tbody) return;

  let dragRow = null;

  document.querySelectorAll('tr[data-id][data-locked="false"]').forEach(function(row) {
    row.setAttribute('draggable', 'true');

    row.addEventListener('dragstart', function(e) {
      dragRow = row;
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(function() { row.classList.add('ally-dragging'); }, 0);
    });

    row.addEventListener('dragend', function() {
      row.classList.remove('ally-dragging');
      tbody.querySelectorAll('.ally-drag-over').forEach(function(r) { r.classList.remove('ally-drag-over'); });
      if (dragRow) saveOrder();
      dragRow = null;
    });
  });

  tbody.addEventListener('dragover', function(e) {
    e.preventDefault();
    if (!dragRow) return;
    const target = e.target.closest('tr[data-id][data-locked="false"]');
    if (!target || target === dragRow) return;
    tbody.querySelectorAll('.ally-drag-over').forEach(function(r) { r.classList.remove('ally-drag-over'); });
    target.classList.add('ally-drag-over');
    const rect = target.getBoundingClientRect();
    if (e.clientY < rect.top + rect.height / 2) {
      tbody.insertBefore(dragRow, target);
    } else {
      tbody.insertBefore(dragRow, target.nextElementSibling);
    }
  });

  async function saveOrder() {
    const lockedCount = tbody.querySelectorAll('tr[data-locked="true"]').length;
    const order = Array.from(tbody.querySelectorAll('tr[data-id][data-locked="false"]')).map(function(row, i) {
      return { id: row.dataset.id, order: lockedCount + i };
    });
    try {
      await fetchAPI('/allies/reorder', { method: 'POST', body: JSON.stringify({ order }) });
      adminToast('Orden guardado', 'success');
    } catch (err) {
      adminToast('Error al guardar orden', 'error');
    }
  }
})();
