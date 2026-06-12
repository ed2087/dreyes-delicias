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
    description: 'Custom websites & web apps built from scratch — no templates, no WordPress. Soluciones digitales a medida para negocios que quieren calidad sin compromisos.',
    link:        'https://www.codedevhub.com/',
    ctaText:     "Let's Build Something",
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
    link:        'https://www.nanarii.com/',
    ctaText:     'Explorar el directorio',
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
    for (const seed of LOCKED) {
      const { defaultImage, ...fields } = seed;
      const existing = await Ally.findOne({ name: seed.name, locked: true });

      if (existing) {
        // Update text fields only — never overwrite a user-uploaded image
        existing.description = fields.description;
        existing.link        = fields.link;
        existing.ctaText     = fields.ctaText;
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
