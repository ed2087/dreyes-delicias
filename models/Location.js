/* ============================================
   LOCATION MODEL
   Purpose: Live truck location and operating hours
   ============================================ */

const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  address: { type: String, default: '437 Morgan Mill Rd, Monroe, NC 28110' },
  lat: { type: Number, default: null },
  lng: { type: Number, default: null },
  googleMapsUrl: { type: String, default: '' },
  embedUrl: { type: String, default: '' },
  isOpen: { type: Boolean, default: false },
  hours: {
    monday:    { open: { type: String, default: '4:00 PM' }, close: { type: String, default: '10:00 PM' }, active: { type: Boolean, default: false } },
    tuesday:   { open: { type: String, default: '4:00 PM' }, close: { type: String, default: '10:00 PM' }, active: { type: Boolean, default: false } },
    wednesday: { open: { type: String, default: '4:00 PM' }, close: { type: String, default: '10:00 PM' }, active: { type: Boolean, default: true  } },
    thursday:  { open: { type: String, default: '4:00 PM' }, close: { type: String, default: '10:00 PM' }, active: { type: Boolean, default: true  } },
    friday:    { open: { type: String, default: '4:00 PM' }, close: { type: String, default: '11:00 PM' }, active: { type: Boolean, default: true  } },
    saturday:  { open: { type: String, default: '4:00 PM' }, close: { type: String, default: '11:00 PM' }, active: { type: Boolean, default: true  } },
    sunday:    { open: { type: String, default: '4:00 PM' }, close: { type: String, default: '10:00 PM' }, active: { type: Boolean, default: false } }
  },
  note_es: { type: String, default: '' },
  note_en: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Location', locationSchema);
