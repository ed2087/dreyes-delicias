/* ============================================
   GALLERY CONTROLLER
   Purpose: Full gallery management — upload, reorder, delete
   ============================================ */

const GalleryPhoto = require('../models/GalleryPhoto');
const { deleteFile } = require('../services/cloudinaryService');

exports.getPhotos = async (req, res) => {
  try {
    const filter = {};
    if (req.query.album && req.query.album !== 'all') filter.album = req.query.album;
    if (req.query.featured === 'true') filter.featured = true;

    const photos = await GalleryPhoto.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, photos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.uploadPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const album = req.body.album || 'food';
    const lastPhoto = await GalleryPhoto.findOne().sort({ order: -1 });
    let nextOrder = lastPhoto ? lastPhoto.order + 1 : 0;

    const photos = await Promise.all(
      req.files.map((file, i) => GalleryPhoto.create({
        url:       file.path,
        publicId:  file.filename,
        album,
        order:     nextOrder + i
      }))
    );

    res.status(201).json({ success: true, photos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePhoto = async (req, res) => {
  try {
    const photo = await GalleryPhoto.findById(req.params.id);
    if (!photo) return res.status(404).json({ success: false, message: 'Not found' });

    const { album, caption_es, caption_en, featured } = req.body;

    if (album)      photo.album      = album;
    if (caption_es !== undefined) photo.caption_es = caption_es;
    if (caption_en !== undefined) photo.caption_en = caption_en;
    if (featured  !== undefined) photo.featured   = featured === 'true';

    await photo.save();
    res.json({ success: true, photo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const photo = await GalleryPhoto.findById(req.params.id);
    if (!photo) return res.status(404).json({ success: false, message: 'Not found' });

    await deleteFile(photo.publicId);
    await photo.deleteOne();

    res.json({ success: true, message: 'Photo deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.reorderPhotos = async (req, res) => {
  try {
    const { order } = req.body; // [{ id, order }]
    await Promise.all(order.map(({ id, order: o }) => GalleryPhoto.findByIdAndUpdate(id, { order: o })));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
