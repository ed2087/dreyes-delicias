/* ============================================
   SEO MIDDLEWARE
   Purpose: Generate SEO meta objects for every page
   ============================================ */

const SITE_URL  = (process.env.SITE_URL || 'https://dreyesdelicias.com').replace(/^http:/, 'https:');
const SITE_NAME = process.env.SITE_NAME || "D'Reyes Delicias";

const defaults = {
  landing: {
    title_es: "D'Reyes Delicias — Taquizas & Banquetes en Monroe, NC",
    title_en: "D'Reyes Delicias — Taquizas & Banquets in Monroe, NC",
    description_es: "Auténtica comida latina en Monroe, NC. Tacos, burritos, quesabirrias, banquetes y taquizas a domicilio para quinceañeras, bodas, graduaciones y todo tipo de eventos en Union County.",
    description_en: "Authentic Latin food truck in Monroe, NC. Tacos, burritos, quesabirrias, full banquets and taquiza catering for quinceañeras, weddings, graduations and all events in Union County.",
    keywords: 'taquizas monroe nc, food truck monroe nc, comida latina monroe nc, banquetes monroe nc, tacos monroe nc, catering latino union county nc, taquiza a domicilio monroe, quesabirrias monroe nc, food truck catering nc, quinceañeras monroe nc, bodas catering monroe nc, mexican food monroe nc',
    image: '/images/og-home.jpg',
    type: 'website',
    canonicalPath: '/'
  },
  menu: {
    title_es: "Menú — Tacos, Burritos, Quesabirrias | D'Reyes Delicias",
    title_en: "Menu — Tacos, Burritos, Quesabirrias | D'Reyes Delicias",
    description_es: 'Conoce nuestro menú completo. Tacos tradicionales, quesabirrias, burritos, quesadillas, tortas y más sabores latinos auténticos en Monroe, NC.',
    description_en: 'Explore our full menu. Traditional tacos, quesabirrias, burritos, quesadillas, tortas and more authentic Latin flavors in Monroe, NC.',
    keywords: 'menu tacos monroe nc, quesabirrias monroe, burritos latinos monroe nc, tortas monroe nc, comida mexicana monroe nc, tacos carne asada monroe, tacos al pastor monroe nc',
    canonicalPath: '/menu'
  },
  services: {
    title_es: "Servicios de Catering — Taquizas y Banquetes | D'Reyes Delicias",
    title_en: "Catering Services — Taquizas & Banquets | D'Reyes Delicias",
    description_es: 'Taquizas a domicilio y banquetes completos para bodas, quinceañeras, graduaciones y eventos corporativos en Monroe, NC y Union County. Llámanos al (980) 271-4205.',
    description_en: 'Taquiza catering and full banquets for weddings, quinceañeras, graduations and corporate events in Monroe, NC and Union County. Call (980) 271-4205.',
    keywords: 'catering taquiza monroe nc, banquetes monroe nc, taquiza a domicilio union county, catering quinceañeras monroe, catering bodas monroe nc, catering corporativo monroe nc, food truck events monroe nc, taquiza graduaciones monroe',
    canonicalPath: '/services'
  },
  gallery: {
    title_es: "Galería de Fotos — Comida y Eventos | D'Reyes Delicias",
    title_en: "Photo Gallery — Food & Events | D'Reyes Delicias",
    description_es: 'Fotos de nuestros tacos, burritos, quesabirrias, food truck y eventos especiales en Monroe, NC. Mira la calidad y el sabor de D\'Reyes Delicias.',
    description_en: 'Photos of our tacos, burritos, quesabirrias, food truck and special events in Monroe, NC. See the quality and flavor of D\'Reyes Delicias.',
    keywords: 'fotos food truck monroe nc, galería comida latina monroe, tacos fotos monroe nc, eventos catering fotos monroe',
    canonicalPath: '/gallery'
  },
  contact: {
    title_es: "Contáctanos — Cotizaciones y Reservaciones | D'Reyes Delicias",
    title_en: "Contact Us — Quotes & Reservations | D'Reyes Delicias",
    description_es: 'Contáctanos para cotizaciones de taquizas, banquetes y reservaciones de eventos en Monroe, NC. WhatsApp o llámanos al (980) 271-4205.',
    description_en: 'Contact us for taquiza quotes, banquet packages and event reservations in Monroe, NC. WhatsApp or call (980) 271-4205.',
    keywords: 'contacto taquiza monroe nc, cotizacion banquete monroe, reservar food truck monroe nc, telefono dreyes delicias',
    canonicalPath: '/contact'
  },
  location: {
    title_es: "Ubicación y Horarios — Monroe, NC | D'Reyes Delicias",
    title_en: "Location & Hours — Monroe, NC | D'Reyes Delicias",
    description_es: 'Encuéntranos en Monroe, NC. 437 Morgan Mill Rd. Horarios: miércoles-jueves 4–10pm, viernes-sábado 4–11pm. Comida latina auténtica en Union County.',
    description_en: 'Find us in Monroe, NC. 437 Morgan Mill Rd. Hours: Wednesday-Thursday 4–10pm, Friday-Saturday 4–11pm. Authentic Latin food in Union County.',
    keywords: 'ubicacion food truck monroe nc, horarios dreyes delicias, 437 morgan mill rd monroe nc, comida latina union county nc, donde comer tacos monroe nc',
    canonicalPath: '/location'
  },
  negocios: {
    title_es: "Negocios Latinos que Recomendamos | D'Reyes Delicias Monroe NC",
    title_en: "Latino Businesses We Recommend | D'Reyes Delicias Monroe NC",
    description_es: "Descubre los mejores negocios latinos que D'Reyes Delicias recomienda en Monroe, NC y Union County. Directorio de la comunidad latina local.",
    description_en: "Discover the best Latino businesses D'Reyes Delicias recommends in Monroe, NC and Union County. Local Latino community directory.",
    keywords: 'negocios latinos monroe nc, directorio latino monroe, comunidad latina union county nc, empresas latinas monroe nc, negocios hispanos monroe nc',
    canonicalPath: '/negocios'
  },
  error: {
    title_es: 'Página no encontrada',
    title_en: 'Page not found',
    description_es: 'La página que buscas no existe.',
    description_en: 'The page you are looking for does not exist.',
    noIndex: true,
    canonicalPath: '/404'
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
