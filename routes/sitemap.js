'use strict';
/* ============================================
   SITEMAP + ROBOTS
   Routes: GET /sitemap.xml, GET /robots.txt
   ============================================ */

const express    = require('express');
const router     = express.Router();
const MenuItem   = require('../models/MenuItem');
const Service    = require('../models/Service');
const Ally       = require('../models/Ally');

const SITE_URL = (process.env.SITE_URL || 'https://dreyesdelicias.com').replace(/^http:/, 'https:');
const TODAY    = new Date().toISOString().split('T')[0];

/* ── Static pages ─────────────────────────────────────────────────────────── */
const STATIC_PAGES = [
  { path: '/',         priority: '1.0', changefreq: 'weekly'  },
  { path: '/menu',     priority: '0.9', changefreq: 'weekly'  },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/location', priority: '0.9', changefreq: 'weekly'  },
  { path: '/contact',  priority: '0.8', changefreq: 'monthly' },
  { path: '/gallery',  priority: '0.7', changefreq: 'weekly'  },
  { path: '/negocios', priority: '0.6', changefreq: 'monthly' },
];

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/* ── GET /sitemap.xml ─────────────────────────────────────────────────────── */
router.get('/sitemap.xml', async (req, res) => {
  try {
    const [menuItems, services, allies] = await Promise.all([
      MenuItem.find({ available: true }).select('slug updatedAt').lean(),
      Service.find({}).select('slug updatedAt').lean(),
      Ally.find({ active: true }).select('slug updatedAt').lean(),
    ]);

    const entries = [];

    for (const page of STATIC_PAGES) {
      entries.push(urlEntry({
        loc: `${SITE_URL}${page.path}`,
        lastmod: TODAY,
        changefreq: page.changefreq,
        priority: page.priority,
      }));
    }

    for (const item of menuItems) {
      entries.push(urlEntry({
        loc: `${SITE_URL}/menu/${item.slug}`,
        lastmod: item.updatedAt ? item.updatedAt.toISOString().split('T')[0] : TODAY,
        changefreq: 'monthly',
        priority: '0.7',
      }));
    }

    for (const svc of services) {
      entries.push(urlEntry({
        loc: `${SITE_URL}/services/${svc.slug}`,
        lastmod: svc.updatedAt ? svc.updatedAt.toISOString().split('T')[0] : TODAY,
        changefreq: 'monthly',
        priority: '0.8',
      }));
    }

    for (const ally of allies) {
      entries.push(urlEntry({
        loc: `${SITE_URL}/negocios/${ally.slug}`,
        lastmod: ally.updatedAt ? ally.updatedAt.toISOString().split('T')[0] : TODAY,
        changefreq: 'monthly',
        priority: '0.5',
      }));
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>`;

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) {
    res.status(500).send('<?xml version="1.0"?><error>Sitemap unavailable</error>');
  }
});

/* ── GET /robots.txt ──────────────────────────────────────────────────────── */
router.get('/robots.txt', (req, res) => {
  const body = `User-agent: *
Allow: /

Disallow: /admin
Disallow: /api/
Disallow: /set-lang/

Sitemap: ${SITE_URL}/sitemap.xml
`;
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=86400');
  res.send(body);
});

module.exports = router;
