/* ============================================
   ALLIES API
   Purpose: CRUD for business partners
   ============================================ */

const express  = require('express');
const router   = express.Router();
const { protectAPI } = require('../../middleware/auth');
const Ally     = require('../../models/Ally');
const { allyUploader, deleteFile } = require('../../services/cloudinaryService');

const IS_PROD = process.env.NODE_ENV === 'production';

router.get('/', protectAPI, async (req, res) => {
  const allies = await Ally.find().sort({ order: 1 }).catch(() => []);
  res.json({ success: true, allies });
});

router.post('/', protectAPI, allyUploader.single('image'), async (req, res) => {
  try {
    const { name, description, shortDesc, shortDescEn, fullDesc, fullDescEn, category, link, ctaText, active, featured } = req.body;
    const count = await Ally.countDocuments();
    const ally  = new Ally({
      name,
      description: description || '',
      shortDesc:   shortDesc || '',
      shortDescEn: shortDescEn || '',
      fullDesc:    fullDesc || '',
      fullDescEn:  fullDescEn || '',
      category:    category || 'Servicios',
      link:        link || '',
      ctaText:     ctaText || '',
      active:      active !== 'false',
      featured:    featured === 'true' || featured === true,
      order:       count
    });
    if (req.file) {
      ally.image = { url: req.file.path, publicId: req.file.filename };
    }
    await ally.save();
    res.json({ success: true, ally });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/reorder', protectAPI, async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) return res.status(400).json({ success: false, message: 'Invalid payload' });
    await Promise.all(order.map(item =>
      Ally.updateOne({ _id: item.id, ...(IS_PROD && { locked: { $ne: true } }) }, { $set: { order: item.order } })
    ));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', protectAPI, allyUploader.single('image'), async (req, res) => {
  try {
    const ally = await Ally.findById(req.params.id);
    if (!ally)       return res.status(404).json({ success: false, message: 'Not found' });
    if (ally.locked && IS_PROD) return res.status(403).json({ success: false, message: 'Este colaborador está bloqueado y no puede modificarse.' });

    const { name, description, shortDesc, shortDescEn, fullDesc, fullDescEn, category, link, ctaText, active, featured } = req.body;
    if (name        !== undefined) ally.name        = name;
    if (description !== undefined) ally.description = description;
    if (shortDesc   !== undefined) ally.shortDesc   = shortDesc;
    if (shortDescEn !== undefined) ally.shortDescEn = shortDescEn;
    if (fullDesc    !== undefined) ally.fullDesc    = fullDesc;
    if (fullDescEn  !== undefined) ally.fullDescEn  = fullDescEn;
    if (category    !== undefined) ally.category    = category;
    if (link        !== undefined) ally.link        = link;
    if (ctaText     !== undefined) ally.ctaText     = ctaText;
    if (active      !== undefined) ally.active      = active !== 'false';
    if (featured    !== undefined) ally.featured    = featured === 'true' || featured === true;

    if (req.file) {
      if (ally.image.publicId) await deleteFile(ally.image.publicId);
      ally.image = { url: req.file.path, publicId: req.file.filename };
    }

    await ally.save();
    res.json({ success: true, ally });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protectAPI, async (req, res) => {
  try {
    const ally = await Ally.findById(req.params.id);
    if (!ally)       return res.status(404).json({ success: false, message: 'Not found' });
    if (ally.locked && IS_PROD) return res.status(403).json({ success: false, message: 'Este colaborador esta bloqueado y no puede eliminarse.' });

    if (ally.image.publicId) await deleteFile(ally.image.publicId);
    await ally.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
