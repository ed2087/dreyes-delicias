/* ============================================
   MENU ITEM MODEL
   Purpose: Food menu items — bilingual, Cloudinary photo
   ============================================ */

const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name_es: { type: String, required: true, trim: true },
  name_en: { type: String, required: true, trim: true },
  description_es: { type: String, default: '' },
  description_en: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
  image: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  gallery: [{
    url: { type: String },
    publicId: { type: String }
  }],
  allergens:    [{ type: String }],
  dietaryTags:  [{ type: String }],
  spiceLevel:   { type: Number, default: 0, min: 0, max: 3 },
  portionInfo:  { type: String, default: '' },
  ingredients:  { type: String, default: '' },
  featured: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  slug: { type: String, unique: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
