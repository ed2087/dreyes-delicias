/* ============================================
   SEO MIDDLEWARE
   Purpose: Generate SEO meta objects for every page
   ============================================ */

const SITE_URL  = process.env.SITE_URL  || 'https://dreyesdelicias.com';
const SITE_NAME = process.env.SITE_NAME || "D'Reyes Delicias";

const defaults = {
  landing: {
    title_es: "D'Reyes Delicias — Taquizas & Banquetes en Monroe, NC",
    title_en: "D'Reyes Delicias — Taquizas & Banquets in Monroe, NC",
    description_es: 'Auténtica comida latina. Tacos, burritos, quesadillas y más. Servicio de taquiza y banquete para todo tipo de eventos en Monroe, NC.',
    description_en: 'Authentic Latin food. Tacos, burritos, quesadillas and more. Taquiza and banquet service for all types of events in Monroe, NC.',
    keywords: 'taquizas monroe nc, food truck monroe nc, comida latina monroe, banquetes monroe nc, tacos monroe nc',
    image: '/images/og-home.jpg',
    type: 'website',
    canonicalPath: '/'
  },
  menu: {
    title_es: 'Menú',
    title_en: 'Menu',
    description_es: 'Conoce nuestro menú completo. Tacos, burritos, quesadillas, hamburguesas y más sabores latinos auténticos.',
    description_en: 'Explore our full menu. Tacos, burritos, quesadillas, burgers and more authentic Latin flavors.',
    canonicalPath: '/menu'
  },
  services: {
    title_es: 'Servicios',
    title_en: 'Services',
    description_es: 'Taquizas y banquetes para bodas, quinceañeras, eventos corporativos y más.',
    description_en: 'Taquizas and banquets for weddings, quinceañeras, corporate events and more.',
    canonicalPath: '/services'
  },
  gallery: {
    title_es: 'Galería',
    title_en: 'Gallery',
    description_es: 'Fotos de nuestra comida, nuestro food truck y eventos especiales.',
    description_en: 'Photos of our food, our food truck and special events.',
    canonicalPath: '/gallery'
  },
  contact: {
    title_es: 'Contacto',
    title_en: 'Contact',
    description_es: 'Contáctanos para cotizaciones, reservaciones o preguntas.',
    description_en: 'Contact us for quotes, reservations or questions.',
    canonicalPath: '/contact'
  },
  location: {
    title_es: 'Ubicación',
    title_en: 'Location',
    description_es: 'Encuéntranos en Monroe, NC. Consulta nuestra ubicación actual y horarios.',
    description_en: 'Find us in Monroe, NC. Check our current location and hours.',
    canonicalPath: '/location'
  },
  error: {
    title_es: 'Error',
    title_en: 'Error',
    description_es: 'Ha ocurrido un error.',
    description_en: 'An error occurred.',
    noIndex: true,
    canonicalPath: '/error'
  }
};

/**
 * Generate SEO data object for a page
 * @param {string} page - Key from defaults above
 * @param {string} lang - 'es' or 'en'
 * @param {Object} custom - Override any field
 * @returns {Object}
 */
function generateSEO(page, lang = 'es', custom = {}) {
  const base = defaults[page] || defaults.error;
  const merged = { ...base, ...custom };

  const title       = merged[`title_${lang}`]       || merged.title_es       || page;
  const description = merged[`description_${lang}`] || merged.description_es || '';
  const canonicalPath = merged.canonicalPath || `/${page}`;

  return {
    title,
    description,
    keywords:      merged.keywords || '',
    canonicalPath,
    canonicalUrl:  `${SITE_URL}${canonicalPath}`,
    image:         merged.image || '/images/og-default.jpg',
    imageUrl:      `${SITE_URL}${merged.image || '/images/og-default.jpg'}`,
    type:          merged.type || 'website',
    siteName:      SITE_NAME,
    noIndex:       merged.noIndex || false,
    noFollow:      merged.noFollow || false
  };
}

module.exports = { generateSEO };
