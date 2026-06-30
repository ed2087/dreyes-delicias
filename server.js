/* ============================================
   SERVER.JS
   Purpose: Main Express entry point for D'Reyes Delicias
   ============================================ */

require('dotenv').config();

const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const helmet       = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit    = require('express-rate-limit');

const connectDB            = require('./config/database');
const i18n                 = require('./middleware/i18n');
const { csrfProtect }      = require('./middleware/auth');
const { generateSEO }      = require('./middleware/seo');
const { generateBreadcrumbs } = require('./middleware/breadcrumbs');
const { logError }         = require('./utils/errorLogger');

const app = express();

// ── Open/closed helper (Eastern Time, Monroe NC) ─────────────────────────────
function computeOpen(location) {
  if (!location) return false;
  const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const et   = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const dayName = days[et.getDay()];
  const dayData = location.hours && location.hours[dayName];
  const scheduledOpen = !!(dayData && dayData.active);
  return scheduledOpen ? !!location.isOpen : false;
}

// ── Database ─────────────────────────────────────────────────────────────────
connectDB().then(() => {
  require('./utils/seedAllies')();
  require('./utils/seedServices')();
});

// ── Security ─────────────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      scriptSrc:  ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
      imgSrc:     ["'self'", "data:", "blob:", "https:", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
      fontSrc:    ["'self'", "data:"],
      connectSrc: ["'self'", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://analytics.google.com", "https://region1.google-analytics.com"],
      frameSrc:   ["'self'", "https://www.google.com", "https://maps.google.com"]
    }
  }
}));

app.use(mongoSanitize());

// ── www redirect (non-www → www, production only) ─────────────────────────────
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers.host === 'dreyesdelicias.com') {
    return res.redirect(301, 'https://www.dreyesdelicias.com' + req.url);
  }
  next();
});

// ── Parsing + Static ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ── View Engine ───────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Language toggle route ─────────────────────────────────────────────────────
app.get('/set-lang/:lang', (req, res) => {
  const lang = req.params.lang === 'en' ? 'en' : 'es';
  res.cookie('lang', lang, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: false });
  res.redirect(req.headers.referer || '/');
});

// ── i18n on all routes ────────────────────────────────────────────────────────
app.use(i18n);

// ── Rate limiting ─────────────────────────────────────────────────────────────
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
const apiLimiter  = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });

app.use('/api/admin/login', authLimiter);
app.use('/api', apiLimiter);
app.use('/api', csrfProtect);

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/admin',   require('./routes/api/admin'));
app.use('/api/menu',    require('./routes/api/menu'));
app.use('/api/services',require('./routes/api/services'));
app.use('/api/gallery', require('./routes/api/gallery'));
app.use('/api/location',require('./routes/api/location'));
app.use('/api/messages',require('./routes/api/messages'));
app.use('/api/contact', require('./routes/api/contact'));
app.use('/api/allies',  require('./routes/api/allies'));

// ── QR code redirect (printed on business cards) ─────────────────────────────
app.get('/qr', (req, res) => res.redirect(301, '/'));

// ── Sitemap + Robots ─────────────────────────────────────────────────────────
app.use('/', require('./routes/sitemap'));

// ── View Routes — Public ─────────────────────────────────────────────────────
app.get('/', async (req, res) => {
  const [featuredPhotos, featuredDishes, services, location, allies] = await Promise.all([
    require('./models/GalleryPhoto').find({ featured: true }).sort({ order: 1 }).limit(10),
    require('./models/MenuItem').find({ featured: true, available: true }).sort({ order: 1 }).limit(6),
    require('./models/Service').find({}).sort({ order: 1 }).limit(3),
    require('./models/Location').findOne(),
    require('./models/Ally').find({ active: true, $or: [{ featured: true }, { locked: true }] }).sort({ order: 1 })
  ]).catch(() => [[], [], [], null, []]);

  res.render('landing', {
    seo: generateSEO('landing', res.locals.lang),
    pageCSS: 'landing',
    pageJS: 'landing',
    partialCSS: ['gallery-slider'],
    partialJS: ['gallery-slider'],
    featuredPhotos,
    featuredDishes,
    services,
    location,
    locationIsOpen: computeOpen(location),
    allies
  });
});

app.get('/menu', async (req, res) => {
  const MenuItem = require('./models/MenuItem');
  const items = await MenuItem.find({ available: true }).sort({ category: 1, order: 1 }).catch(() => []);

  res.render('menu', {
    seo: generateSEO('menu', res.locals.lang),
    breadcrumbs: generateBreadcrumbs('/menu', res.locals.lang),
    pageCSS: 'menu',
    pageJS: 'menu',
    partialCSS: ['breadcrumbs'],
    partialJS: [],
    items
  });
});

app.get('/menu/:slug', async (req, res) => {
  const MenuItem = require('./models/MenuItem');
  const item = await MenuItem.findOne({ slug: req.params.slug }).catch(() => null);

  if (!item) return res.status(404).render('error', {
    statusCode: 404,
    seo: generateSEO('error', res.locals.lang || 'es'),
    pageCSS: 'error', pageJS: null, partialCSS: [], partialJS: []
  });

  const lang = res.locals.lang;
  const itemName = item[`name_${lang}`] || item.name_es;

  const related = await MenuItem
    .find({ category: item.category, _id: { $ne: item._id }, available: true })
    .limit(4)
    .sort({ order: 1 })
    .catch(() => []);

  res.render('menu-item', {
    seo: generateSEO('menu', lang, {
      title_es: item.name_es,
      title_en: item.name_en,
      description_es: item.description_es,
      description_en: item.description_en,
      image: item.image?.url || '/images/og-default.jpg',
      canonicalPath: `/menu/${item.slug}`
    }),
    breadcrumbs: generateBreadcrumbs(`/menu/${item.slug}`, lang, { [item.slug]: itemName }),
    pageCSS: 'menu-item',
    pageJS: 'menu-item',
    partialCSS: ['breadcrumbs'],
    partialJS: [],
    item,
    related
  });
});

app.get('/services', async (req, res) => {
  const Service = require('./models/Service');
  const services = await Service.find().sort({ order: 1 }).catch(() => []);

  res.render('services', {
    seo: generateSEO('services', res.locals.lang),
    breadcrumbs: generateBreadcrumbs('/services', res.locals.lang),
    pageCSS: 'services',
    pageJS: null,
    partialCSS: ['breadcrumbs'],
    partialJS: [],
    services
  });
});

app.get('/services/:slug', async (req, res) => {
  const Service = require('./models/Service');
  const service = await Service.findOne({ slug: req.params.slug }).catch(() => null);

  if (!service) return res.status(404).render('error', {
    statusCode: 404,
    seo: generateSEO('error', res.locals.lang || 'es'),
    pageCSS: 'error', pageJS: null, partialCSS: [], partialJS: []
  });

  const lang = res.locals.lang;
  const serviceName = service[`name_${lang}`] || service.name_es;

  const others = await Service
    .find({ _id: { $ne: service._id } })
    .limit(3)
    .sort({ order: 1 })
    .catch(() => []);

  res.render('service-detail', {
    seo: generateSEO('services', lang, {
      title_es: service.name_es,
      title_en: service.name_en,
      description_es: service.description_es,
      description_en: service.description_en,
      canonicalPath: `/services/${service.slug}`
    }),
    breadcrumbs: generateBreadcrumbs(`/services/${service.slug}`, lang, { [service.slug]: serviceName }),
    pageCSS: 'service-detail',
    pageJS: 'service-detail',
    partialCSS: ['breadcrumbs'],
    partialJS: [],
    service,
    others
  });
});

app.get('/negocios', async (req, res) => {
  const Ally = require('./models/Ally');
  const negocios = await Ally.find({ active: true }).sort({ order: 1 }).catch(() => []);
  res.render('negocios', {
    seo: generateSEO('negocios', res.locals.lang),
    breadcrumbs: generateBreadcrumbs('/negocios', res.locals.lang),
    pageCSS: 'negocios',
    pageJS: null,
    partialCSS: ['breadcrumbs'],
    partialJS: [],
    negocios
  });
});

app.get('/negocios/:slug', async (req, res) => {
  const Ally = require('./models/Ally');
  const negocio = await Ally.findOne({ slug: req.params.slug, active: true }).catch(() => null);
  if (!negocio) return res.status(404).render('error', {
    statusCode: 404,
    seo: generateSEO('error', res.locals.lang || 'es'),
    pageCSS: 'error', pageJS: null, partialCSS: [], partialJS: []
  });
  const lang = res.locals.lang;
  const others = await Ally.find({ _id: { $ne: negocio._id }, active: true }).limit(3).sort({ order: 1 }).catch(() => []);
  res.render('negocio-detail', {
    seo: generateSEO('negocios', lang, {
      title_es: negocio.name, title_en: negocio.name,
      description_es: negocio.shortDesc || negocio.description,
      description_en: negocio.shortDescEn || negocio.shortDesc || negocio.description,
      canonicalPath: `/negocios/${negocio.slug}`
    }),
    breadcrumbs: generateBreadcrumbs(`/negocios/${negocio.slug}`, lang, { [negocio.slug]: negocio.name }),
    pageCSS: 'negocios',
    pageJS: null,
    partialCSS: ['breadcrumbs'],
    partialJS: [],
    negocio,
    others
  });
});

app.get('/gallery', async (req, res) => {
  const GalleryPhoto = require('./models/GalleryPhoto');
  const album = req.query.album || 'all';

  const filter = album === 'all' ? {} : { album };
  const [photos, usedAlbums] = await Promise.all([
    GalleryPhoto.find(filter).sort({ order: 1, createdAt: -1 }),
    GalleryPhoto.distinct('album')
  ]).catch(() => [[], []]);

  res.render('gallery', {
    seo: generateSEO('gallery', res.locals.lang),
    breadcrumbs: generateBreadcrumbs('/gallery', res.locals.lang),
    pageCSS: 'gallery',
    pageJS: 'gallery',
    partialCSS: ['breadcrumbs'],
    partialJS: [],
    photos,
    activeAlbum: album,
    usedAlbums
  });
});

app.get('/contact', async (req, res) => {
  const location = await require('./models/Location').findOne().catch(() => null);
  res.render('contact', {
    seo: generateSEO('contact', res.locals.lang),
    breadcrumbs: generateBreadcrumbs('/contact', res.locals.lang),
    pageCSS: 'contact',
    pageJS: 'contact',
    partialCSS: ['breadcrumbs'],
    partialJS: [],
    location
  });
});

app.get('/location', async (req, res) => {
  const Location = require('./models/Location');
  const location = await Location.findOne().catch(() => null);

  res.render('location', {
    seo: generateSEO('location', res.locals.lang),
    breadcrumbs: generateBreadcrumbs('/location', res.locals.lang),
    pageCSS: 'location',
    pageJS: 'location',
    partialCSS: ['breadcrumbs'],
    partialJS: [],
    location,
    locationIsOpen: computeOpen(location)
  });
});

// ── View Routes — Admin ───────────────────────────────────────────────────────
app.use('/admin', require('./routes/views/admin'));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'Route not found' });
  }
  // Static asset 404 — don't render EJS, just send status
  if (!req.accepts('html')) {
    return res.status(404).end();
  }
  res.status(404).render('error', {
    statusCode: 404,
    seo: generateSEO('error', res.locals.lang || 'es'),
    pageCSS: 'error', pageJS: null, partialCSS: [], partialJS: []
  });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(async (err, req, res, next) => {
  await logError(err, req);

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong. Please try again.'
    : err.message;

  if (req.path.startsWith('/api/')) {
    return res.status(statusCode).json({ success: false, message });
  }

  res.status(statusCode).render('error', {
    statusCode,
    seo: generateSEO('error', res.locals.lang || 'es'),
    pageCSS: 'error', pageJS: null, partialCSS: [], partialJS: []
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
