/* ============================================
   ALLY MODEL
   Purpose: Business partners/collaborators
   ============================================ */

const mongoose = require('mongoose');

const allySchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, unique: true, sparse: true },
  category:    { type: String, default: 'Servicios', trim: true },
  description: { type: String, trim: true, default: '' },
  shortDesc:   { type: String, trim: true, default: '' },
  shortDescEn: { type: String, trim: true, default: '' },
  fullDesc:    { type: String, trim: true, default: '' },
  fullDescEn:  { type: String, trim: true, default: '' },
  image:       {
    url:      { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  link:        { type: String, default: '' },
  ctaText:     { type: String, default: '' },
  featured:    { type: Boolean, default: false },
  locked:      { type: Boolean, default: false },
  active:      { type: Boolean, default: true },
  order:       { type: Number, default: 0 }
}, { timestamps: true });

allySchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

module.exports = mongoose.model('Ally', allySchema);
