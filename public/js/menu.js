/* ============================================
   MENU PAGE SCRIPT
   Purpose: Category filter for menu grid
   ============================================ */

(function initMenu() {
  const pills   = document.querySelectorAll('.cat-pill');
  const cards   = document.querySelectorAll('.menu-item-card');

  if (!pills.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const category = pill.dataset.category;

      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();
