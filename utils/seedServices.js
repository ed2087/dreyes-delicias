'use strict';
/* ============================================
   SEED SERVICES
   Upserts Taquiza + Banquete on startup.
   Images are NOT overwritten.
   ============================================ */

const Service = require('../models/Service');

const SERVICES = [
  /* ── 1. TAQUIZA ───────────────────────────────────────────── */
  {
    slug:     'taquiza-a-domicilio',
    order:    1,
    featured: true,

    name_es: 'Taquiza a Domicilio',
    name_en: 'Taco Catering',

    shortDesc_es: 'Los mejores tacos de Monroe NC servidos en tu evento. Tu casa, tu jardín, tu celebración. Nosotros llevamos todo.',
    shortDesc_en: 'The best tacos in Monroe NC served live at your event. Your home, your backyard, your celebration. We bring everything.',

    description_es: `La taquiza más auténtica de Monroe, NC, directamente en tu evento.

D'Reyes Delicias llega a donde estés. Casa, jardín, parque, salón. Llegamos con todo el equipo y el sabor para convertir tu celebración en algo que nadie va a olvidar.

Nuestra taquiza incluye tortillas de maíz y harina recién calentadas, proteínas a tu elección y toda la garnachería completa. Cilantro fresco, cebolla, rábanos, jalapeños y limones. Y lo que no puede faltar, nuestras salsas caseras verde, roja y pico de gallo.

Las proteínas que manejamos son carne asada, carnitas, pollo, al pastor, chorizo y barbacoa.

Nuestros tacos más pedidos son los Tacos Tradicionales, los Tacos Reyes dorados con cilantro y cebolla, las Quesabirrias en tortilla de maíz con consomé de res y los Crunchy Tacos para los que quieren algo diferente.

La taquiza es perfecta para quinceañeras, cumpleaños, reuniones familiares, graduaciones, eventos corporativos y bodas.

Atendemos eventos en Monroe, NC y toda el área de Union County. Escríbenos hoy y ponemos la taquiza a correr.`,

    description_en: `The most authentic taquiza in Monroe, NC brought straight to your event.

D'Reyes Delicias comes to you. Home, backyard, park, venue. We show up with all the equipment and flavor to turn your celebration into something nobody forgets.

Our taquiza includes freshly warmed corn and flour tortillas, your choice of proteins, and a full garnish station. Fresh cilantro, onion, radishes, jalapeños, and lime. Plus our house-made salsas, verde, roja, and pico de gallo.

Proteins we carry: carne asada, carnitas, chicken, al pastor, chorizo, and barbacoa.

Our most requested tacos are the Traditional Tacos, the golden Tacos Reyes with cilantro and onion, Quesabirrias on corn tortilla with beef consommé, and Crunchy Tacos for something different.

Perfect for quinceañeras, birthdays, family gatherings, graduations, corporate events, and weddings.

We serve Monroe, NC and all of Union County. Message us today and let's get your taquiza rolling.`,

    menuTitle_es: '¿Qué servimos?',
    menuTitle_en: 'What we serve',
    menuItems: [
      { name: 'Tacos Tradicionales y Tacos Reyes', detail: 'Tortilla de maíz o harina, proteína a elegir, cilantro, cebolla y salsas' },
      { name: 'Quesabirrias',                       detail: 'Tortilla de maíz, queso fundido, carne de res y consomé, el hit de la noche' },
      { name: 'Crunchy Tacos',                      detail: 'Taco de concha dura, proteína, lechuga, queso y salsas' },
      { name: 'Proteínas disponibles',              detail: 'Carne asada, carnitas, pollo, al pastor, chorizo y barbacoa' },
      { name: 'Salsas caseras',                     detail: 'Salsa verde, salsa roja, pico de gallo y guacamole' },
      { name: 'Bebidas',                            detail: 'Aguas frescas, Jarritos y refrescos en botella' },
    ],

    closingNote_es: 'Escríbenos por WhatsApp o llámanos al (980) 271-4205. Respondemos rápido y te damos todos los detalles. Servimos Monroe, NC y Union County.',
    closingNote_en: 'Message us on WhatsApp or call (980) 271-4205. We respond fast and walk you through every detail. Serving Monroe, NC and Union County.',
  },

  /* ── 2. BANQUETE ──────────────────────────────────────────── */
  {
    slug:     'banquete-completo',
    order:    2,
    featured: true,

    name_es: 'Banquete Completo',
    name_en: 'Full Banquet',

    shortDesc_es: "Más que tacos. Un banquete con arroz, frijoles, platillos completos y todo el sabor de D'Reyes Delicias para celebrar a lo grande.",
    shortDesc_en: "More than tacos. A full banquet with rice, beans, complete dishes, and all the flavor of D'Reyes Delicias to celebrate right.",

    description_es: `Cuando la celebración lo merece todo.

El Banquete Completo de D'Reyes Delicias es para los eventos donde no se escatima. Llevamos a tu evento un menú completo con la sazón auténtica que nos ha hecho el favorito de Monroe, NC.

Esto incluye arroz rojo y frijoles de olla preparados frescos el día del evento, burritos clásicos con proteína, arroz, frijoles, queso, crema y guacamole, quesadillas con queso fundido y proteína a elección, Torta Tradicional y Mega Torta para quien quiera algo diferente, Quesabirrias con consomé de res, tostadas crujientes con proteína, lechuga y queso, salchipapas con papas fritas y salsas especiales, guacamole, pico de gallo y salsas caseras sin límite y aguas frescas, Jarritos y refrescos.

Atendemos quinceañeras y XV años, bodas y uniones civiles, graduaciones y despedidas, reuniones corporativas y eventos empresariales, y todo tipo de celebraciones familiares grandes.

Nosotros coordinamos todo para que tú solo te preocupes por disfrutar tu evento. Desde la llegada hasta que el último invitado quede satisfecho.

Atendemos Monroe, NC y toda el área de Union County.`,

    description_en: `When the celebration deserves everything.

The Full Banquet from D'Reyes Delicias is for the events where you go all in. We bring a complete menu to your event with the authentic flavor that has made us Monroe NC's go-to for Latin catering.

This includes red rice and pot beans cooked fresh the day of the event, classic burritos with protein, rice, beans, cheese, sour cream and guacamole, quesadillas with melted cheese and your choice of protein, Traditional Torta and Mega Torta for something bold, Quesabirrias with beef consommé, crispy tostadas with protein, lettuce and cheese, salchipapas with fries and house sauces, unlimited guacamole, pico de gallo and house-made salsas, and agua frescas, Jarritos and bottled sodas.

We serve quinceañeras, weddings, civil ceremonies, graduations, farewell parties, corporate events, and large family celebrations.

We handle the full setup so all you have to do is enjoy your event. From the moment we arrive to the last guest served.

Serving Monroe, NC and all of Union County.`,

    menuTitle_es: 'Lo que incluye el banquete',
    menuTitle_en: 'What the banquet includes',
    menuItems: [
      { name: 'Arroz y Frijoles',   detail: 'Arroz rojo y frijoles de olla preparados frescos, la base de todo buen banquete' },
      { name: 'Burritos Clásicos',  detail: 'Proteína, arroz, frijoles, queso, crema y guacamole en una tortilla grande' },
      { name: 'Quesadillas',        detail: 'Tortilla de harina, queso fundido y proteína a elección' },
      { name: 'Quesabirrias',       detail: 'Tortilla de maíz, queso, carne de res y consomé' },
      { name: 'Tostadas y Tortas',  detail: 'Tostadas crujientes, Torta Tradicional y Mega Torta' },
      { name: 'Guacamole y Salsas', detail: 'Guacamole fresco, pico de gallo, salsa verde y salsa roja' },
      { name: 'Salchipapas',        detail: 'Papas fritas con salchicha y salsas especiales de la casa' },
      { name: 'Bebidas',            detail: 'Aguas frescas, Jarritos y refrescos en botella' },
    ],

    closingNote_es: 'Cada banquete es diferente. Cuéntanos cuántos invitados son, la fecha y el tipo de evento. Escríbenos por WhatsApp o llámanos al (980) 271-4205. Servimos Monroe, NC y toda el área de Union County.',
    closingNote_en: 'Every banquet is different. Tell us your guest count, date, and event type. Message us on WhatsApp or call (980) 271-4205. We serve Monroe, NC and all of Union County.',
  },
];

async function seedServices() {
  for (const data of SERVICES) {
    const { slug, ...fields } = data;
    const existing = await Service.findOne({ slug });

    if (existing) {
      const update = { ...fields };
      if (existing.image && existing.image.url) delete update.image;
      if (existing.gallery && existing.gallery.length > 0) delete update.gallery;
      await Service.updateOne({ slug }, { $set: update });
      console.log(`[seedServices] Updated: ${slug}`);
    } else {
      await Service.create({ slug, ...fields });
      console.log(`[seedServices] Created: ${slug}`);
    }
  }
}

module.exports = seedServices;
