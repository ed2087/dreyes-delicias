/* ============================================
   MENU CONTROLLER
   Purpose: CRUD for menu items
   ============================================ */

const MenuItem = require('../models/MenuItem');
const { createSlug } = require('../utils/helpers');
const { deleteFile } = require('../services/cloudinaryService');

async function uniqueSlug(name, excludeId = null) {
  const base = createSlug(name);
  let slug = base;
  let n = 1;
  while (true) {
    const q = { slug };
    if (excludeId) q._id = { $ne: excludeId };
    if (!(await MenuItem.findOne(q))) break;
    slug = `${base}-${n++}`;
  }
  return slug;
}

/** @route GET /api/menu */
exports.getItems = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === 'true') filter.featured = true;
    if (req.query.available !== 'false') filter.available = true;

    const items = await MenuItem.find(filter).sort({ category: 1, order: 1 });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/** @route GET /api/menu/:id */
exports.getItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/** @route POST /api/menu */
exports.createItem = async (req, res) => {
  try {
    const { name_es, name_en, description_es, description_en, price, category,
            spiceLevel, portionInfo, ingredients, featured, available, order } = req.body;
    const allergens   = [].concat(req.body.allergens   || []);
    const dietaryTags = [].concat(req.body.dietaryTags || []);
    const imageFile    = req.files?.['image']?.[0];
    const galleryFiles = req.files?.['gallery'] || [];

    const item = await MenuItem.create({
      name_es, name_en: name_en || name_es,
      description_es: description_es || '',
      description_en: description_en || '',
      price: parseFloat(price) || 0,
      category: (category || '').trim(),
      allergens, dietaryTags,
      spiceLevel: parseInt(spiceLevel) || 0,
      portionInfo: portionInfo || '',
      ingredients: ingredients || '',
      featured: featured === 'true',
      available: available !== 'false',
      order: parseInt(order) || 0,
      slug: await uniqueSlug(name_es),
      image: imageFile ? { url: imageFile.path, publicId: imageFile.filename } : { url: '', publicId: '' },
      gallery: galleryFiles.map(f => ({ url: f.path, publicId: f.filename }))
    });

    res.status(201).json({ success: true, item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/** @route PUT /api/menu/:id */
exports.updateItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    const { name_es, name_en, description_es, description_en, price, category,
            spiceLevel, portionInfo, ingredients, featured, available, order } = req.body;
    const allergens   = [].concat(req.body.allergens   || []);
    const dietaryTags = [].concat(req.body.dietaryTags || []);
    const imageFile    = req.files?.['image']?.[0];
    const galleryFiles = req.files?.['gallery'] || [];

    if (name_es && name_es !== item.name_es) {
      item.slug = await uniqueSlug(name_es, item._id);
    }

    item.name_es        = name_es        || item.name_es;
    item.name_en        = name_en        || item.name_en;
    item.description_es = description_es !== undefined ? description_es : item.description_es;
    item.description_en = description_en !== undefined ? description_en : item.description_en;
    item.price          = price          !== undefined ? parseFloat(price) : item.price;
    item.category       = category ? category.trim() : item.category;
    item.allergens      = allergens;
    item.dietaryTags    = dietaryTags;
    item.spiceLevel     = spiceLevel     !== undefined ? parseInt(spiceLevel)  : item.spiceLevel;
    item.portionInfo    = portionInfo    !== undefined ? portionInfo            : item.portionInfo;
    item.ingredients    = ingredients   !== undefined ? ingredients            : item.ingredients;
    item.featured       = featured  !== undefined ? featured  === 'true' : item.featured;
    item.available      = available !== undefined ? available !== 'false' : item.available;
    item.order          = order     !== undefined ? parseInt(order)       : item.order;

    if (imageFile) {
      if (item.image?.publicId) await deleteFile(item.image.publicId);
      item.image = { url: imageFile.path, publicId: imageFile.filename };
    }

    if (galleryFiles.length > 0) {
      const newPhotos = galleryFiles.map(f => ({ url: f.path, publicId: f.filename }));
      item.gallery = [...(item.gallery || []), ...newPhotos];
    }

    await item.save();
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** @route DELETE /api/menu/:id/gallery/:idx */
exports.deleteGalleryImage = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });

    const idx = parseInt(req.params.idx);
    if (isNaN(idx) || idx < 0 || idx >= item.gallery.length)
      return res.status(400).json({ success: false, message: 'Invalid index' });

    const [removed] = item.gallery.splice(idx, 1);
    if (removed?.publicId) await deleteFile(removed.publicId);

    await item.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** @route DELETE /api/menu/:id */
exports.deleteItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    if (item.image?.publicId) await deleteFile(item.image.publicId);
    for (const g of (item.gallery || [])) {
      if (g.publicId) await deleteFile(g.publicId);
    }
    await item.deleteOne();

    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/** @route PUT /api/menu/reorder/batch */
exports.reorderItems = async (req, res) => {
  try {
    const { order } = req.body; // [{ id, order }]
    await Promise.all(order.map(({ id, order: o }) => MenuItem.findByIdAndUpdate(id, { order: o })));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
