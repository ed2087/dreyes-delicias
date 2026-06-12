/* ============================================
   LOCATION CONTROLLER
   Purpose: Get and update live truck location
   ============================================ */

const Location = require('../models/Location');

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

    if (address        !== undefined) location.address        = address;
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
