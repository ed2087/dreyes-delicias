/* ============================================
   BREADCRUMBS MIDDLEWARE
   Purpose: Generate breadcrumb arrays for public pages
   ============================================ */

const LABELS = {
  es: {
    home: 'Inicio', menu: 'Menú', services: 'Servicios',
    gallery: 'Galería', contact: 'Contacto', location: 'Ubicación'
  },
  en: {
    home: 'Home', menu: 'Menu', services: 'Services',
    gallery: 'Gallery', contact: 'Contact', location: 'Location'
  }
};

/**
 * Generate breadcrumbs array
 * @param {string} currentPath - e.g. '/menu/tacos-al-pastor'
 * @param {string} lang - 'es' or 'en'
 * @param {Object} custom - { slug: 'Display Name' }
 * @returns {Array}
 */
function generateBreadcrumbs(currentPath, lang = 'es', custom = {}) {
  const labels = LABELS[lang] || LABELS.es;

  const crumbs = [{ name: labels.home, url: '/', active: false }];

  const segments = currentPath.split('/').filter(Boolean);
  let builtPath = '';

  segments.forEach((segment, index) => {
    builtPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    const name = custom[segment] || labels[segment] || (segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '));

    crumbs.push({ name, url: builtPath, active: isLast });
  });

  return crumbs;
}

module.exports = { generateBreadcrumbs };
