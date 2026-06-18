'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const MENU_ITEMS = [
  // ── Tacos ──────────────────────────────────────────────────────────────────
  {
    name_es: 'Tacos Tradicionales',
    name_en: 'Traditional Tacos',
    description_es: 'Los tacos mexicanos más tradicionales servidos con cilantro, cebolla, salsa verde y salsa picante. Servidos con tu proteína favorita.',
    description_en: 'The most traditional Mexican Tacos served with cilantro, onions, green sauce & hot sauce. Topped with your choice of protein.',
    price: 4.50,
    category: 'Tacos',
    featured: true,
    order: 1
  },
  {
    name_es: 'Tacos Reyes',
    name_en: 'Reyes Tacos',
    description_es: 'Nuestra versión del taco tradicional, servido en tortillas de maíz o harina doradas con cilantro, cebolla, salsa verde y roja.',
    description_en: 'Our own version of the traditional taco, served on golden corn or flour tortillas with cilantro, onions, green sauce & red sauce.',
    price: 4.75,
    category: 'Tacos',
    featured: true,
    order: 2
  },
  {
    name_es: 'Crunchy Tacos',
    name_en: 'Crunchy Tacos',
    description_es: '¡Satisface tu antojo con nuestros nuevos Crunchy Tacos! Deliciosos tacos de taco duro servidos con tu proteína favorita.',
    description_en: 'Satisfy your craving with our new Crunchy Tacos! Delicious hard-shell tacos served with your choice of protein.',
    price: 4.75,
    category: 'Tacos',
    order: 3
  },
  // ── Burritos ───────────────────────────────────────────────────────────────
  {
    name_es: 'Burrito',
    name_en: 'Burrito',
    description_es: 'Nuestro clásico burrito es una obra maestra perfectamente enrollada, rellena con una porción abundante de proteína, arroz, frijoles, queso, crema y guacamole.',
    description_en: 'Our Classic Burrito is a perfectly rolled masterpiece, stuffed with a hearty portion of protein, rice, beans, cheese, sour cream, and guacamole.',
    price: 16.50,
    category: 'Burritos',
    featured: true,
    order: 10
  },
  // ── Tortas ─────────────────────────────────────────────────────────────────
  {
    name_es: 'Mega Torta',
    name_en: 'Mega Torta',
    description_es: '¡Sumérgete en nuestra Mega Torta, el sándwich definitivo para un apetito verdaderamente robusto! Todo lo que amas en una torta grande y generosa.',
    description_en: 'Dive into our Mega Torta, the ultimate sandwich for a truly hearty appetite! Everything you love in one big, generous torta.',
    price: 17.99,
    category: 'Tortas',
    order: 21
  },
  {
    name_es: 'Torta Tradicional',
    name_en: 'Traditional Torta',
    description_es: 'Sumérgete en nuestra Torta Tradicional, un clásico auténtico que es toda una comida. Comenzamos con un telera crujiente y rellenamos con tu proteína favorita.',
    description_en: 'Dive into our Traditional Torta, a true classic that is a meal in itself. We start with a crusty telera roll and stuff it with your favorite protein.',
    price: 15.50,
    category: 'Tortas',
    order: 20
  },
  // ── Quesadillas ────────────────────────────────────────────────────────────
  {
    name_es: 'Quesadilla',
    name_en: 'Quesadilla',
    description_es: '¿Listo para un placer quesoso? Nuestra Quesadilla Clásica tiene una gran tortilla de harina cargada de queso derretido y tu proteína favorita.',
    description_en: 'Ready for a cheesy delight? Our Classic Quesadilla features a large flour tortilla loaded with melted cheese and your choice of protein.',
    price: 15.50,
    category: 'Quesadillas',
    featured: true,
    order: 30
  },
  // ── Hot Dogs ───────────────────────────────────────────────────────────────
  {
    name_es: 'Reyes Hot Dog',
    name_en: 'Reyes Hot Dog',
    description_es: '¡Trátate con nuestro Hot Dog Reyes! Una salchicha jugosa en pan suave, cubierta con nuestros aderezos exclusivos al estilo Reyes.',
    description_en: 'Treat yourself to our signature Reyes Hot Dog! A plump hot dog nestled in a soft bun, topped with our exclusive Reyes-style toppings.',
    price: 11.99,
    category: 'Hot Dogs',
    order: 40
  },
  // ── Quesabirrias ───────────────────────────────────────────────────────────
  {
    name_es: '3 Quesabirrias',
    name_en: '3 Quesabirrias',
    description_es: 'Servidas en tortillas de maíz con cilantro, cebolla, queso y un pequeño consomé de res.',
    description_en: 'Served in corn tortillas with cilantro, onions, cheese, and a small steak consommé.',
    price: 15.50,
    category: 'Quesabirrias',
    featured: true,
    order: 50
  },
  // ── Salchipapas ────────────────────────────────────────────────────────────
  {
    name_es: 'Salchipapas',
    name_en: 'Salchipapas',
    description_es: '¡Disfruta de nuestras Salchipapas, la comida reconfortante definitiva con un giro! Papas fritas abundantes combinadas con salchicha y nuestras salsas especiales.',
    description_en: 'Indulge in our Salchipapas, the ultimate comfort food with a twist! A generous pile of fries combined with sausage and our special sauces.',
    price: 11.99,
    category: 'Salchipapas',
    order: 60
  },
  // ── Tostadas ───────────────────────────────────────────────────────────────
  {
    name_es: '3 Tostadas',
    name_en: '3 Tostadas',
    description_es: 'Muérdete nuestras Tostadas Crujientes, un plato de tres tostadas crujientes de maíz, cada una cubierta con proteína fresca, lechuga, queso y salsas.',
    description_en: 'Sink your teeth into our Crunchy Tostadas, a plate of three crispy corn tortillas, each topped with fresh protein, lettuce, cheese, and sauces.',
    price: 15.50,
    category: 'Tostadas',
    order: 70
  },
  // ── Sides ──────────────────────────────────────────────────────────────────
  {
    name_es: 'Papas Fritas',
    name_en: 'French Fries / Papas Fritas',
    description_es: 'Papas fritas crujientes y doradas, perfectas como acompañamiento.',
    description_en: 'Crispy golden french fries, perfect as a side.',
    price: 4.50,
    category: 'Sides',
    order: 80
  },
  // ── Drinks ─────────────────────────────────────────────────────────────────
  {
    name_es: 'Refresco en Botella',
    name_en: 'Plastic Bottle Soda',
    description_es: 'Refresco frío en botella de plástico. Selección disponible al pedir.',
    description_en: 'Cold soda in a plastic bottle. Selection available upon ordering.',
    price: 3.50,
    category: 'Drinks',
    order: 90
  },
  {
    name_es: 'Agua Fresca',
    name_en: 'Agua Fresca',
    description_es: '¡Disfruta de un sabor auténtico de México! Nuestra Agua Fresca está disponible en tres sabores refrescantes.',
    description_en: 'Indulge in a taste of Mexico with our authentic Agua Fresca! Choose from three refreshing flavors.',
    price: 5.50,
    category: 'Drinks',
    order: 91
  },
  {
    name_es: 'Jarritos',
    name_en: 'Jarritos',
    description_es: 'Refresco mexicano tradicional Jarritos. El sabor más auténtico de México.',
    description_en: 'Traditional Mexican Jarritos soda. The most authentic taste of Mexico.',
    price: 4.50,
    category: 'Drinks',
    order: 92
  }
];

async function seedMenu() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const deleted = await MenuItem.deleteMany({});
    console.log(`Deleted ${deleted.deletedCount} existing menu items`);

    for (let i = 0; i < MENU_ITEMS.length; i++) {
      const item = MENU_ITEMS[i];
      const slug = slugify(item.name_en) + '-' + i;
      await MenuItem.create({ ...item, slug, available: true });
      console.log(`Created: ${item.name_en}`);
    }

    console.log(`\nDone — ${MENU_ITEMS.length} menu items inserted.`);
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seedMenu();
