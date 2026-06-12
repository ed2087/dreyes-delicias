/* ============================================
   NAV PARTIAL SCRIPT
   Purpose: Scroll behavior, hamburger, fullscreen mobile menu
   ============================================ */

(function initNav() {
  const nav       = document.getElementById('siteNav');
  const hamburger = document.getElementById('navHamburger');
  const menu      = document.getElementById('mobileMenu');
  const closeBtn  = document.getElementById('mmClose');

  if (!nav) return;

  // Scroll — add scrolled class
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!hamburger || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close on link click
  menu.querySelectorAll('.mm-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on backdrop click
  menu.querySelector('.mm-backdrop').addEventListener('click', closeMenu);

  // ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();
