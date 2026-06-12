/* ============================================
   SERVICE MODEL
   Purpose: Services offered — bilingual, Cloudinary photo
   ============================================ */

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name_es: { type: String, required: true, trim: true },
  name_en: { type: String, required: true, trim: true },
  description_es: { type: String, default: '' },
  description_en: { type: String, default: '' },
  shortDesc_es: { type: String, default: '' },
  shortDesc_en: { type: String, default: '' },
  image: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  gallery: [
    {
      url: { type: String },
      publicId: { type: String }
    }
  ],
  menuTitle_es:   { type: String, default: '' },
  menuTitle_en:   { type: String, default: '' },
  menuItems: [{
    name:   { type: String, default: '' },
    detail: { type: String, default: '' }
  }],
  pricingTitle_es: { type: String, default: '' },
  pricingTitle_en: { type: String, default: '' },
  pricingRows: [{
    label: { type: String, default: '' },
    price: { type: String, default: '' }
  }],
  closingNote_es: { type: String, default: '' },
  closingNote_en: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  slug: { type: String, unique: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);
