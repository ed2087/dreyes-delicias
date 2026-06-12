/* ============================================
   GALLERY PHOTO MODEL
   Purpose: Managed photo gallery — albums, ordering, featured
   ============================================ */

const mongoose = require('mongoose');

const galleryPhotoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  thumbnailUrl: { type: String, default: '' },
  album: {
    type: String,
    required: true,
    enum: ['food', 'truck', 'events'],
    default: 'food'
  },
  caption_es: { type: String, default: '' },
  caption_en: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GalleryPhoto', galleryPhotoSchema);
