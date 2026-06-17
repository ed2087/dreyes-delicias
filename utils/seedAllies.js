/* ============================================
   SEED ALLIES
   Upserts locked partners on startup.
   Images are NOT overwritten — preserve
   whatever was uploaded via the CMS.
   ============================================ */

const Ally = require('../models/Ally');

const LOCKED = [
  {
    name:        'CodeDevHub',
    description: 'Sitios web y apps web personalizadas, hechas desde cero — sin plantillas, sin WordPress.',
    shortDesc:   'Sitios web y apps web personalizadas, hechas desde cero — sin plantillas, sin WordPress.',
    shortDescEn: 'Custom websites & web apps built from scratch — no templates, no WordPress.',
    fullDesc:    'En CodeDevHub diseñamos y desarrollamos soluciones digitales a medida para negocios que quieren calidad real. Sitios web, tiendas en línea, CMS, SEO y más.',
    fullDescEn:  'At CodeDevHub we design and develop custom digital solutions for businesses that demand real quality. Websites, online stores, custom CMS, SEO, and more.',
    link:        'https://www.codedevhub.com/',
    ctaText:     "Let's Build Something",
    category:    'Negocios',
    locked:      true,
    active:      true,
    order:       0,
    defaultImage: {
      url:       'https://res.cloudinary.com/dwlib8nke/image/upload/v1781223109/og-default_btlvro.png',
      publicId:  ''
    }
  },
  {
    name:        'Nanarii.com',
    description: 'Directorio gratuito de negocios latinos en USA y México. Crea tu perfil, aparece en Google y conecta con tu comunidad — en español, sin contratos, 100% gratis.',
    shortDesc:   'Directorio gratuito de negocios latinos en USA. Crea tu perfil y conecta con tu comunidad.',
    shortDescEn: 'Free directory of Latino businesses in the USA. Create your profile and connect with your community.',
    fullDesc:    'Nanarii es un directorio gratuito de negocios latinos en USA y México. Crea tu perfil, aparece en Google y conecta con tu comunidad — en español, sin contratos, 100% gratis.',
    fullDescEn:  'Nanarii is a free directory of Latino businesses in the USA and Mexico. Create your profile, appear on Google, and connect with your community — in Spanish, no contracts, 100% free.',
    link:        'https://www.nanarii.com/',
    ctaText:     'Explorar el directorio',
    category:    'Negocios',
    locked:      true,
    active:      true,
    order:       1,
    defaultImage: {
      url:       '',
      publicId:  ''
    }
  }
];

async function seedAllies() {
  try {
    // Backfill slugs for any ally that doesn't have one yet
    const noSlug = await Ally.find({ $or: [{ slug: null }, { slug: '' }, { slug: { $exists: false } }] });
    for (const ally of noSlug) {
      await ally.save(); // pre-save hook generates slug
    }

    // Migrate old default category "Servicios" → "Negocios"
    await Ally.updateMany(
      { $or: [{ category: 'Servicios' }, { category: null }, { category: '' }, { category: { $exists: false } }] },
      { $set: { category: 'Negocios' } }
    );

    for (const seed of LOCKED) {
      const { defaultImage, ...fields } = seed;
      const existing = await Ally.findOne({ name: seed.name, locked: true });

      if (existing) {
        // Update text fields only — never overwrite a user-uploaded image
        existing.description = fields.description;
        existing.shortDesc   = fields.shortDesc;
        existing.shortDescEn = fields.shortDescEn;
        existing.fullDesc    = fields.fullDesc;
        existing.fullDescEn  = fields.fullDescEn;
        existing.link        = fields.link;
        existing.ctaText     = fields.ctaText;
        existing.category    = fields.category;
        existing.active      = fields.active;
        existing.order       = fields.order;
        // Only fall back to defaultImage if the CMS image is still empty
        if (!existing.image || !existing.image.url) {
          existing.image = defaultImage;
        }
        await existing.save();
        console.log(`[seed] Updated locked ally: ${seed.name}`);
      } else {
        await Ally.create({ ...fields, image: defaultImage });
        console.log(`[seed] Created locked ally: ${seed.name}`);
      }
    }
  } catch (err) {
    console.error('[seed] Ally seed error:', err.message);
  }
}

module.exports = seedAllies;
