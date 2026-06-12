/* ============================================
   ALLY MODEL
   Purpose: Business partners/collaborators
   ============================================ */

const mongoose = require('mongoose');

const allySchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  image:       {
    url:      { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  link:        { type: String, default: '' },
  ctaText:     { type: String, default: 'Visit Website' },
  locked:      { type: Boolean, default: false },
  active:      { type: Boolean, default: true },
  order:       { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Ally', allySchema);
