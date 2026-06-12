# D'Reyes Delicias — Food Truck Website

Full-stack website and CMS for **D'Reyes Delicias**, a Latin food truck based in Monroe, NC. Built by [CodeDevHub](https://www.codedevhub.com/).

---

## Tech Stack

| Layer | Tech |
|---|---|
| Runtime | Node.js (CommonJS) |
| Framework | Express 4 |
| Templating | EJS 3 |
| Database | MongoDB Atlas via Mongoose |
| Image hosting | Cloudinary v1 |
| File uploads | Multer + multer-storage-cloudinary |
| Auth | JWT stored in httpOnly cookies |
| Security | Helmet, express-mongo-sanitize, express-rate-limit |
| Email | Nodemailer (Gmail App Password) |
| i18n | Custom cookie-based EN/ES toggle |

---

## Project Structure

```
dreyes-delicias/
├── config/
│   └── database.js          # Mongoose connection
├── controllers/             # Route handler logic
├── locales/
│   ├── en.json              # English translations
│   └── es.json              # Spanish translations
├── middleware/
│   ├── auth.js              # JWT protect, protectAPI, csrfProtect
│   ├── breadcrumbs.js       # Auto breadcrumb generator
│   ├── i18n.js              # Attaches t() and lang to res.locals
│   └── seo.js               # generateSEO() per route
├── models/
│   ├── Admin.js             # CMS admin user
│   ├── Ally.js              # Collaborator/partner businesses
│   ├── ErrorLog.js          # Server error log
│   ├── GalleryPhoto.js      # Gallery images
│   ├── Location.js          # Address + hours
│   ├── MenuItem.js          # Menu items (bilingual, slugged)
│   ├── Message.js           # Contact form submissions
│   └── Service.js           # Catering/event services
├── public/
│   ├── css/                 # Per-page CSS + partials
│   ├── images/              # Static images (logo.webp)
│   └── js/                  # Per-page JS + admin JS
├── routes/
│   ├── api/                 # REST API routes (JSON)
│   └── views/admin.js       # Admin CMS view routes
├── scripts/
│   └── seed-admin.js        # Creates the first admin account
├── services/
│   ├── cloudinaryService.js # buildUploader(folder) factory
│   ├── emailService.js      # sendEmail() wrapper
│   └── tokenService.js      # JWT sign/verify
├── utils/
│   ├── errorLogger.js       # Logs errors to DB
│   ├── helpers.js           # Misc utilities
│   └── seedAllies.js        # Auto-upserts locked ally records on boot
├── views/
│   ├── admin/               # CMS admin pages (EJS)
│   ├── partials/            # Shared nav, footer, head, modals
│   └── *.ejs                # Public pages
├── .env.example             # Environment variable template
├── .gitignore
├── package.json
└── server.js                # Entry point
```

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/ed2087/dreyes-delicias.git
cd dreyes-delicias
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
NODE_ENV=development
PORT=3000

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/dreyes-delicias

# JWT — use a long random string
JWT_SECRET=change-this-to-a-long-random-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Gmail (contact form emails)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=dreyesdelicias@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_TO=dreyesdelicias@gmail.com

# Site
SITE_URL=https://dreyesdelicias.com
SITE_NAME=D'Reyes Delicias
```

### 3. Seed the admin account

Run once to create the CMS login:

```bash
npm run seed
```

This creates the admin user in MongoDB. You can change the email/password inside `scripts/seed-admin.js` before running.

### 4. Start the dev server

```bash
npm run dev
```

Site is at `http://localhost:3000`
Admin panel is at `http://localhost:3000/admin`

### 5. Start in production

```bash
npm start
```

---

## Public Pages

| URL | Page |
|---|---|
| `/` | Landing — hero, gallery slider, featured dishes, services, allies |
| `/menu` | Full menu grouped by category |
| `/menu/:slug` | Individual menu item detail |
| `/services` | Catering & events overview |
| `/services/:slug` | Individual service detail |
| `/gallery` | Photo gallery with album filters |
| `/location` | Map + address + hours |
| `/contact` | Contact form (sends email + saves to DB) |

Language toggle available on all pages via `/set-lang/en` and `/set-lang/es`.

---

## Admin CMS — `/admin`

Login at `/admin/login`. JWT token is stored in an httpOnly cookie (15-day expiry).

### Sections

#### Menu Items — `/admin/menu`
- Add, edit, delete menu items
- Fields: name (ES + EN), description (ES + EN), category, price, image, featured toggle, available toggle, display order
- Images upload to Cloudinary under `dreyes-delicias/menu/`
- Slug is auto-generated from the Spanish name
- Featured items appear on the landing page

#### Services — `/admin/services`
- Add, edit, delete catering/event services
- Fields: name (ES + EN), description (ES + EN), image, display order
- Images upload to Cloudinary under `dreyes-delicias/services/`

#### Gallery — `/admin/gallery`
- Upload photos to albums (food, events, truck, etc.)
- Fields: image, album, caption, featured toggle, display order
- Featured photos appear in the landing page slider
- Images upload to Cloudinary under `dreyes-delicias/gallery/`

#### Location — `/admin/location`
- Edit address, city, state, zip
- Google Maps embed URL (paste the embed src from Google Maps → Share → Embed)

#### Hours — `/admin/hours`
- Set open/closed status per day of the week
- Set open and close time for each day

#### Messages — `/admin/messages`
- View contact form submissions
- Mark as read / delete
- Unread count badge shows in sidebar

#### Collaborators (Allies) — `/admin/allies`
- Add partner businesses that appear in the "Colaboradores" section on the landing page
- Fields: name, description, website URL, CTA button text, image, active toggle
- Images upload to Cloudinary under `dreyes-delicias/allies/`
- **Locked allies** (CodeDevHub and Nanarii) cannot be edited, disabled, or deleted — they show a 🔒 badge

---

## Ally / Collaborator System

The landing page has a billboard-style rotating spotlight for partner businesses.

- Only allies with `active: true` appear on the landing page
- They rotate automatically every 7 seconds with dot navigation
- The order field controls display sequence (lower = first)

### Locked Allies

**CodeDevHub** and **Nanarii.com** are seeded automatically on every server boot via `utils/seedAllies.js`. They are marked `locked: true` in the database, which means:

- The edit button is hidden in the CMS
- The delete button is hidden in the CMS
- The API blocks PUT and DELETE requests for them (returns 403)
- The edit URL redirects back to the ally list

Their images can only be updated by running the seed with a new Cloudinary URL directly in `utils/seedAllies.js`.

---

## Image Uploads

All image uploads go through Cloudinary. The `buildUploader(folder)` function in `services/cloudinaryService.js` creates a Multer middleware for any folder:

```js
const { buildUploader } = require('../../services/cloudinaryService');
const uploader = buildUploader('dreyes-delicias/menu');
router.post('/', uploader.single('image'), async (req, res) => { ... });
```

When editing, leaving the image field empty keeps the existing image. Old images are deleted from Cloudinary when replaced.

**Max upload size:** 10 MB  
**Accepted formats:** PNG, JPG, WebP

---

## Security

- **CSRF protection:** All API POST/PUT/DELETE routes require the `X-Requested-With: XMLHttpRequest` header. The `fetchAPI()` helper in `public/js/admin/admin-global.js` adds this automatically.
- **Rate limiting:** Login endpoint is limited to 10 requests per 15 min. All API routes are limited to 200 requests per 15 min.
- **Mongo sanitization:** `express-mongo-sanitize` strips `$` and `.` from user input to prevent NoSQL injection.
- **Helmet:** Sets security headers. `crossOriginEmbedderPolicy: false` is intentionally disabled to allow Cloudinary images to load.
- **JWT:** Stored in an httpOnly, sameSite cookie — not accessible to JavaScript.
- **Passwords:** Hashed with bcryptjs (cost factor 12).

---

## i18n (Bilingual)

The site supports Spanish (default) and English. Language is stored in a cookie (`lang`).

- Translations live in `locales/es.json` and `locales/en.json`
- The `t()` helper is available in all EJS templates via `res.locals`
- Menu items and services have separate `name_es / name_en` and `description_es / description_en` fields in the DB
- Toggle links: `/set-lang/es` and `/set-lang/en`

---

## SEO

Every page gets meta tags generated by `middleware/seo.js`:

- `<title>`, `<meta name="description">`, Open Graph tags, Twitter card tags
- Canonical URL
- JSON-LD structured data (LocalBusiness schema on the landing page)
- `robots.txt` not currently present — add one before going live

---

## Saving Changes to GitHub

After making any code change:

```bash
git add .
git commit -m "describe what changed"
git push
```

Repository: [github.com/ed2087/dreyes-delicias](https://github.com/ed2087/dreyes-delicias)

---

## Deployment Tips

1. **Environment variables** — Never commit `.env`. Set all vars in your hosting dashboard (Railway, Render, DigitalOcean, etc.).
2. **MongoDB IP whitelist** — On MongoDB Atlas, whitelist your server's IP (or `0.0.0.0/0` for simplicity on a PaaS).
3. **NODE_ENV=production** — Set this in production to suppress stack traces in error pages.
4. **Gmail App Password** — Regular Gmail passwords won't work with Nodemailer. Go to `myaccount.google.com → Security → 2-Step Verification → App Passwords` and generate one for "Mail".
5. **Cloudinary free tier** — 25 GB storage, 25 GB bandwidth/month. Plenty for this site.
6. **Run seed once** — `npm run seed` only needs to run once on a fresh database. Running it again won't duplicate the admin, but be careful.
7. **Domain + HTTPS** — Update `SITE_URL` in `.env` to the live domain once deployed. Use a reverse proxy (Nginx or your PaaS) for HTTPS.

---

## Common Commands

```bash
npm run dev      # Start with nodemon (auto-restart on file changes)
npm start        # Start without nodemon (production)
npm run seed     # Create the first admin account
```

---

*Built and maintained by [CodeDevHub](https://www.codedevhub.com/)*
