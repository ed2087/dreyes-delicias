/* ============================================
   ADMIN MESSAGES SCRIPT
   ============================================ */

(function initAdminMessages() {

  const msgList         = document.getElementById('msgList');
  const filterEmptyEl   = document.getElementById('msgFilterEmpty');
  const topbarBadge     = document.getElementById('topbarUnreadBadge');
  const btnMarkAll      = document.getElementById('btnMarkAllRead');
  const countAllEl      = document.getElementById('countAll');
  const countUnreadEl   = document.getElementById('countUnread');
  const countReadEl     = document.getElementById('countRead');

  let currentFilter = 'all';

  /* ── Helpers ─────────────────────────────────────────────────────────────── */

  function getCards() {
    return msgList ? Array.from(msgList.querySelectorAll('.msg-card')) : [];
  }

  function updateCounts() {
    const cards   = getCards();
    const total   = cards.length;
    const unread  = cards.filter(c => c.dataset.state === 'unread').length;
    const read    = total - unread;

    if (countAllEl)    countAllEl.textContent    = total;
    if (countUnreadEl) countUnreadEl.textContent = unread;
    if (countReadEl)   countReadEl.textContent   = read;

    if (topbarBadge) {
      if (unread > 0) {
        topbarBadge.textContent = `${unread} sin leer`;
        topbarBadge.style.display = '';
      } else {
        topbarBadge.style.display = 'none';
      }
    }

    const sidebarBadge = document.querySelector('.messages-badge');
    if (sidebarBadge) {
      if (unread > 0) sidebarBadge.textContent = unread;
      else sidebarBadge.remove();
    }

    if (btnMarkAll) btnMarkAll.style.display = unread > 0 ? '' : 'none';
  }

  function applyFilter(filter) {
    currentFilter = filter;
    const cards = getCards();
    let visible = 0;

    cards.forEach(function (card) {
      const state = card.dataset.state;
      const show  = filter === 'all'
        || (filter === 'unread' && state === 'unread')
        || (filter === 'read'   && state === 'read');

      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    if (filterEmptyEl) {
      filterEmptyEl.style.display = (visible === 0 && cards.length > 0) ? 'block' : 'none';
    }

    document.querySelectorAll('.msg-tab').forEach(function (tab) {
      tab.classList.toggle('active', tab.dataset.filter === filter);
    });
  }

  /* ── Filter tabs ─────────────────────────────────────────────────────────── */

  document.querySelectorAll('.msg-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      applyFilter(tab.dataset.filter);
    });
  });

  /* ── Expand / collapse message body ─────────────────────────────────────── */

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.msg-expand-btn');
    if (!btn) return;

    const bodyEl = document.getElementById(btn.dataset.target);
    if (!bodyEl) return;

    const expanded = bodyEl.classList.toggle('expanded');
    btn.textContent = expanded ? 'Ver menos ↑' : 'Leer más ↓';
  });

  /* ── Toggle read / unread ────────────────────────────────────────────────── */

  document.addEventListener('click', async function (e) {
    const btn = e.target.closest('.btn-toggle-read');
    if (!btn) return;

    const id      = btn.dataset.id;
    const isRead  = btn.dataset.read === 'true';
    const newRead = !isRead;
    const card    = btn.closest('.msg-card');

    btn.disabled = true;

    try {
      await fetchAPI(`/messages/${id}`, { method: 'PUT', body: { read: newRead } });

      // Update card state
      card.dataset.state = newRead ? 'read' : 'unread';
      card.classList.toggle('is-read',   newRead);
      card.classList.toggle('is-unread', !newRead);

      // Left border
      card.style.borderLeft = newRead ? '' : '3px solid var(--admin-gold)';

      // Avatar
      const avatar = card.querySelector('.msg-avatar');
      if (avatar) {
        avatar.className = `msg-avatar ${newRead ? 'msg-avatar-read' : 'msg-avatar-unread'}`;
      }

      // Dot
      const nameRow = card.querySelector('.msg-header-left');
      const dot = nameRow && nameRow.querySelector('.msg-dot');
      if (newRead && dot) dot.remove();
      if (!newRead && nameRow && !nameRow.querySelector('.msg-dot')) {
        const newDot = document.createElement('div');
        newDot.className = 'msg-dot';
        nameRow.insertBefore(newDot, nameRow.firstChild);
      }

      // Update button
      btn.dataset.read = String(newRead);
      if (newRead) {
        btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg> Sin leer`;
      } else {
        btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Leído`;
      }

      updateCounts();
      applyFilter(currentFilter);
      adminToast(newRead ? 'Marcado como leído' : 'Marcado como no leído');
    } catch (err) {
      adminToast('Error al actualizar', 'error');
    } finally {
      btn.disabled = false;
    }
  });

  /* ── Mark all as read ────────────────────────────────────────────────────── */

  if (btnMarkAll) {
    btnMarkAll.addEventListener('click', async function () {
      btnMarkAll.disabled = true;

      try {
        await fetchAPI('/messages/mark-all-read', { method: 'PUT' });

        getCards().forEach(function (card) {
          if (card.dataset.state === 'unread') {
            card.dataset.state = 'read';
            card.classList.remove('is-unread');
            card.classList.add('is-read');
            card.style.borderLeft = '';

            const avatar = card.querySelector('.msg-avatar');
            if (avatar) avatar.className = 'msg-avatar msg-avatar-read';

            const dot = card.querySelector('.msg-dot');
            if (dot) dot.remove();

            const toggleBtn = card.querySelector('.btn-toggle-read');
            if (toggleBtn) {
              toggleBtn.dataset.read = 'true';
              toggleBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg> Sin leer`;
            }
          }
        });

        updateCounts();
        applyFilter(currentFilter);
        adminToast('Todos los mensajes marcados como leídos');
      } catch (err) {
        adminToast('Error al actualizar', 'error');
      } finally {
        btnMarkAll.disabled = false;
      }
    });
  }

  /* ── Delete message ──────────────────────────────────────────────────────── */

  document.addEventListener('click', async function (e) {
    const btn = e.target.closest('.btn-delete-message');
    if (!btn) return;

    const id   = btn.dataset.id;
    const name = btn.dataset.name || 'este mensaje';

    const ok = await adminConfirm(`¿Eliminar mensaje de "${name}"?`);
    if (!ok) return;

    const card = btn.closest('.msg-card');
    btn.disabled = true;

    try {
      await fetchAPI(`/messages/${id}`, { method: 'DELETE' });

      card.style.transition = 'opacity 0.3s, transform 0.3s';
      card.style.opacity = '0';
      card.style.transform = 'translateX(-12px)';
      setTimeout(function () {
        card.remove();
        updateCounts();
        applyFilter(currentFilter);
      }, 300);

      adminToast('Mensaje eliminado');
    } catch (err) {
      adminToast('Error al eliminar', 'error');
      btn.disabled = false;
    }
  });

})();
