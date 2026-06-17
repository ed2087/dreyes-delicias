/* ============================================
   LOCATION CONTROLLER
   Purpose: Get and update live truck location
   ============================================ */

const https    = require('https');
const Location = require('../models/Location');

function geocodeAddress(address) {
  return new Promise((resolve) => {
    const url = 'https://nominatim.openstreetmap.org/search?q=' +
      encodeURIComponent(address) + '&format=json&limit=1';
    https.get(url, { headers: { 'User-Agent': 'DReyesDelicias/1.0 contact@dreyesdelicias.com' } }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const results = JSON.parse(raw);
          if (results.length > 0) {
            resolve({ lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) });
          } else {
            resolve(null);
          }
        } catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

exports.getLocation = async (req, res) => {
  try {
    let location = await Location.findOne();
    if (!location) location = await Location.create({});
    res.json({ success: true, location });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { address, googleMapsUrl, embedUrl, isOpen, hours, note_es, note_en } = req.body;

    let location = await Location.findOne();
    if (!location) location = new Location();

    if (address !== undefined) {
      const addrChanged = address !== location.address;
      if (addrChanged) location.address = address;
      if (addrChanged || !location.lat || !location.lng) {
        const coords = await geocodeAddress(location.address);
        if (coords) { location.lat = coords.lat; location.lng = coords.lng; }
      }
    }
    if (googleMapsUrl  !== undefined) location.googleMapsUrl  = googleMapsUrl;
    if (embedUrl       !== undefined) location.embedUrl       = embedUrl;
    if (isOpen         !== undefined) location.isOpen         = isOpen === 'true' || isOpen === true;
    if (note_es        !== undefined) location.note_es        = note_es;
    if (note_en        !== undefined) location.note_en        = note_en;

    if (hours) {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      days.forEach(day => {
        if (hours[day]) {
          location.hours[day] = { ...location.hours[day], ...hours[day] };
        }
      });
    }

    location.updatedAt = new Date();
    await location.save();

    res.json({ success: true, location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
