/* ============================================
   ADMIN DASHBOARD SCRIPT
   ============================================ */

(function initDashboard() {
  // Stat cards entrance animation
  document.querySelectorAll('.stat-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 80);
  });

  // Quick action keyboard shortcut hints (just visual polish)
  document.querySelectorAll('.quick-action-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => btn.classList.add('hovered'));
    btn.addEventListener('mouseleave', () => btn.classList.remove('hovered'));
  });
})();
