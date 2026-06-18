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
    description: '¿Listo para un sitio web que realmente trabaje para tu negocio? Sitios web y plataformas digitales hechas desde cero — sin plantillas, sin WordPress, construidas para crecer.',
    shortDesc:   '¿Listo para un sitio web que realmente trabaje para tu negocio? Sitios web y plataformas digitales hechas desde cero — sin plantillas, sin WordPress, construidas para crecer.',
    shortDescEn: 'Ready for a website that actually works for your business? Custom websites, web apps & digital platforms built from scratch — no templates, no WordPress.',
    fullDesc:    'CodeDevHub es el equipo detrás de este sitio. Construyen sitios web, apps web, herramientas con IA, CMS y plataformas completas para negocios que quieren resultados reales — no código genérico. Cada proyecto se construye desde cero para funcionar exactamente como tu negocio lo necesita. Calificación de 5.0 estrellas en Google. Si necesitas presencia digital seria, este es el lugar.',
    fullDescEn:  'CodeDevHub is the team behind this very site. They build custom websites, web apps, AI-powered tools, CMS platforms, and dashboards for businesses that want real results — not cookie-cutter templates. Every project is built from scratch to fit your business exactly. Rated 5.0 stars on Google. Whether you need a professional site or a full business platform, CodeDevHub delivers.',
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
    description: '¿Tienes un negocio y nadie te encuentra en Google? Crea tu perfil gratis en Nanarii — el directorio para negocios latinos en USA — y aparece cuando te buscan.',
    shortDesc:   '¿Tienes un negocio y nadie te encuentra en Google? Crea tu perfil gratis en Nanarii — el directorio para negocios latinos en USA — y aparece cuando te buscan.',
    shortDescEn: "Don't have an online presence for your business? Create your free profile on Nanarii — the Latino business directory in the USA — and get found on Google today.",
    fullDesc:    'Nanarii es el directorio hecho para negocios latinos, en español, sin contratos y para siempre gratis. Sube tus fotos, agrega tu horario y recibe reseñas reales. Cuando alguien busca tu tipo de negocio en tu ciudad, Nanarii los lleva directo a ti — sin pagar anuncios. Miles de negocios ya tienen su perfil. El tuyo debería estar también.',
    fullDescEn:  'Nanarii is a free business directory built for Latino-owned businesses in the USA and Mexico. Add your photos, hours, and services, and start showing up in Google searches — no paid ads, no contracts, forever free. Real reviews, a professional profile, and a direct line to your community. Thousands of businesses already have a profile. Yours should too.',
    link:        'https://www.nanarii.com/',
    ctaText:     'Registrar mi negocio gratis',
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
