/* ============================================
   ADMIN VIEW ROUTES
   Purpose: Render all CMS admin pages
   ============================================ */

const express = require('express');
const router  = express.Router();
const { protect } = require('../../middleware/auth');

const MenuItem    = require('../../models/MenuItem');
const Service     = require('../../models/Service');
const GalleryPhoto = require('../../models/GalleryPhoto');
const Location    = require('../../models/Location');
const Message     = require('../../models/Message');
const Ally        = require('../../models/Ally');

const IS_PROD = process.env.NODE_ENV === 'production';

// ── Login ─────────────────────────────────────────────────────────────────────
router.get('/login', (req, res) => {
  if (req.cookies.adminToken) return res.redirect('/admin');
  res.render('admin/login', { pageCSS: null, pageJS: 'admin/admin-login', partialCSS: [], partialJS: [] });
});

// ── All routes below require auth ─────────────────────────────────────────────
router.use(protect);

// ── Dashboard ─────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  const [menuCount, serviceCount, photoCount, unreadCount] = await Promise.all([
    MenuItem.countDocuments(),
    Service.countDocuments(),
    GalleryPhoto.countDocuments(),
    Message.countDocuments({ read: false })
  ]).catch(() => [0, 0, 0, 0]);

  const recentMessages = await Message.find().sort({ createdAt: -1 }).limit(5).catch(() => []);

  res.render('admin/dashboard', {
    pageCSS: null, pageJS: 'admin/admin-dashboard', partialCSS: [], partialJS: [],
    stats: { menuCount, serviceCount, photoCount, unreadCount },
    recentMessages,
    admin: req.admin
  });
});

// ── Menu ──────────────────────────────────────────────────────────────────────
router.get('/menu', async (req, res) => {
  const items = await MenuItem.find().sort({ category: 1, order: 1 }).catch(() => []);
  res.render('admin/menu', {
    pageCSS: null, pageJS: 'admin/admin-menu', partialCSS: [], partialJS: ['modal-confirm'],
    items
  });
});

router.get('/menu/new', async (req, res) => {
  const categories = await MenuItem.distinct('category').catch(() => []);
  res.render('admin/menu-form', {
    pageCSS: null, pageJS: 'admin/admin-menu-form', partialCSS: [], partialJS: [],
    item: null, isEdit: false, categories
  });
});

router.get('/menu/:id/edit', async (req, res) => {
  const [item, categories] = await Promise.all([
    MenuItem.findById(req.params.id).catch(() => null),
    MenuItem.distinct('category').catch(() => [])
  ]);
  if (!item) return res.redirect('/admin/menu');
  res.render('admin/menu-form', {
    pageCSS: null, pageJS: 'admin/admin-menu-form', partialCSS: [], partialJS: [],
    item, isEdit: true, categories
  });
});

// ── Services ──────────────────────────────────────────────────────────────────
router.get('/services', async (req, res) => {
  const services = await Service.find().sort({ order: 1 }).catch(() => []);
  res.render('admin/services', {
    pageCSS: null, pageJS: 'admin/admin-services', partialCSS: [], partialJS: ['modal-confirm'],
    services
  });
});

router.get('/services/new', (req, res) => {
  res.render('admin/service-form', {
    pageCSS: null, pageJS: 'admin/admin-service-form', partialCSS: [], partialJS: [],
    service: null, isEdit: false
  });
});

router.get('/services/:id/edit', async (req, res) => {
  const service = await Service.findById(req.params.id).catch(() => null);
  if (!service) return res.redirect('/admin/services');
  res.render('admin/service-form', {
    pageCSS: null, pageJS: 'admin/admin-service-form', partialCSS: [], partialJS: [],
    service, isEdit: true
  });
});

// ── Gallery ───────────────────────────────────────────────────────────────────
router.get('/gallery', async (req, res) => {
  const photos = await GalleryPhoto.find().sort({ album: 1, order: 1 }).catch(() => []);
  res.render('admin/gallery', {
    pageCSS: null, pageJS: 'admin/admin-gallery', partialCSS: [], partialJS: ['modal-confirm'],
    photos
  });
});

// ── Location ──────────────────────────────────────────────────────────────────
router.get('/location', async (req, res) => {
  let location = await Location.findOne().catch(() => null);
  if (!location) location = await Location.create({}).catch(() => null);
  res.render('admin/location', {
    pageCSS: null, pageJS: 'admin/admin-location', partialCSS: [], partialJS: [],
    location
  });
});

// ── Hours ─────────────────────────────────────────────────────────────────────
router.get('/hours', async (req, res) => {
  let location = await Location.findOne().catch(() => null);
  if (!location) location = await Location.create({}).catch(() => null);
  res.render('admin/hours', {
    pageCSS: null, pageJS: 'admin/admin-hours', partialCSS: [], partialJS: [],
    location
  });
});

// ── Messages ──────────────────────────────────────────────────────────────────
router.get('/messages', async (req, res) => {
  const [messages, unreadCount] = await Promise.all([
    Message.find().sort({ createdAt: -1 }).catch(() => []),
    Message.countDocuments({ read: false }).catch(() => 0)
  ]);
  res.render('admin/messages', {
    pageCSS: null, pageJS: 'admin/admin-messages', partialCSS: [], partialJS: ['modal-confirm'],
    messages,
    unreadCount
  });
});

// ── Allies ────────────────────────────────────────────────────────────────────
router.get('/allies', async (req, res) => {
  const allies = await Ally.find().sort({ order: 1 }).catch(() => []);
  res.render('admin/allies', {
    pageCSS: null, pageJS: 'admin/admin-allies', partialCSS: [], partialJS: [],
    allies, isProd: IS_PROD
  });
});

router.get('/allies/new', (req, res) => {
  res.render('admin/ally-form', {
    pageCSS: null, pageJS: 'admin/admin-ally-form', partialCSS: [], partialJS: [],
    ally: null, isEdit: false
  });
});

router.get('/allies/:id/edit', async (req, res) => {
  const ally = await Ally.findById(req.params.id).catch(() => null);
  if (!ally)       return res.redirect('/admin/allies');
  if (ally.locked && IS_PROD) return res.redirect('/admin/allies');
  res.render('admin/ally-form', {
    pageCSS: null, pageJS: 'admin/admin-ally-form', partialCSS: [], partialJS: [],
    ally, isEdit: true
  });
});

// ── Logout ────────────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.redirect('/admin/login');
});

module.exports = router;
