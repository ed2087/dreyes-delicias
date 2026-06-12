/* ============================================
   SERVICE CONTROLLER
   ============================================ */

const Service = require('../models/Service');
const { createSlug } = require('../utils/helpers');
const { deleteFile } = require('../services/cloudinaryService');

async function uniqueSlug(name, excludeId = null) {
  const base = createSlug(name);
  let slug = base, n = 1;
  while (true) {
    const q = { slug };
    if (excludeId) q._id = { $ne: excludeId };
    if (!(await Service.findOne(q))) break;
    slug = `${base}-${n++}`;
  }
  return slug;
}

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json({ success: true, services });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, service });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

function parseStructured(body) {
  const menuNames   = [].concat(body.menuItemName   || []);
  const menuDetails = [].concat(body.menuItemDetail  || []);
  const menuItems   = menuNames.map((name, i) => ({ name: name || '', detail: menuDetails[i] || '' }))
                               .filter(item => item.name);

  const pricingLabels = [].concat(body.pricingLabel || []);
  const pricingPrices = [].concat(body.pricingPrice || []);
  const pricingRows   = pricingLabels.map((label, i) => ({ label: label || '', price: pricingPrices[i] || '' }))
                                     .filter(row => row.label);
  return { menuItems, pricingRows };
}

exports.createService = async (req, res) => {
  try {
    const { name_es, name_en, description_es, description_en, shortDesc_es, shortDesc_en,
            menuTitle_es, menuTitle_en, pricingTitle_es, pricingTitle_en,
            closingNote_es, closingNote_en, featured, order } = req.body;
    const { menuItems, pricingRows } = parseStructured(req.body);
    const imageFile    = req.files?.['image']?.[0];
    const galleryFiles = req.files?.['gallery'] || [];

    const service = await Service.create({
      name_es, name_en: name_en || name_es,
      description_es:  description_es  || '',
      description_en:  description_en  || '',
      shortDesc_es:    shortDesc_es    || '',
      shortDesc_en:    shortDesc_en    || '',
      menuTitle_es:    menuTitle_es    || '',
      menuTitle_en:    menuTitle_en    || '',
      menuItems,
      pricingTitle_es: pricingTitle_es || '',
      pricingTitle_en: pricingTitle_en || '',
      pricingRows,
      closingNote_es:  closingNote_es  || '',
      closingNote_en:  closingNote_en  || '',
      featured: featured === 'true',
      order: parseInt(order) || 0,
      slug: await uniqueSlug(name_es),
      image: imageFile ? { url: imageFile.path, publicId: imageFile.filename } : { url: '', publicId: '' },
      gallery: galleryFiles.map(f => ({ url: f.path, publicId: f.filename }))
    });

    res.status(201).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Not found' });

    const { name_es, name_en, description_es, description_en, shortDesc_es, shortDesc_en,
            menuTitle_es, menuTitle_en, pricingTitle_es, pricingTitle_en,
            closingNote_es, closingNote_en, featured, order } = req.body;
    const { menuItems, pricingRows } = parseStructured(req.body);
    const imageFile    = req.files?.['image']?.[0];
    const galleryFiles = req.files?.['gallery'] || [];

    if (name_es && name_es !== service.name_es) {
      service.slug = await uniqueSlug(name_es, service._id);
    }

    service.name_es         = name_es         || service.name_es;
    service.name_en         = name_en         || service.name_en;
    service.description_es  = description_es  !== undefined ? description_es  : service.description_es;
    service.description_en  = description_en  !== undefined ? description_en  : service.description_en;
    service.shortDesc_es    = shortDesc_es    !== undefined ? shortDesc_es    : service.shortDesc_es;
    service.shortDesc_en    = shortDesc_en    !== undefined ? shortDesc_en    : service.shortDesc_en;
    service.menuTitle_es    = menuTitle_es    !== undefined ? menuTitle_es    : service.menuTitle_es;
    service.menuTitle_en    = menuTitle_en    !== undefined ? menuTitle_en    : service.menuTitle_en;
    service.menuItems       = menuItems;
    service.pricingTitle_es = pricingTitle_es !== undefined ? pricingTitle_es : service.pricingTitle_es;
    service.pricingTitle_en = pricingTitle_en !== undefined ? pricingTitle_en : service.pricingTitle_en;
    service.pricingRows     = pricingRows;
    service.closingNote_es  = closingNote_es  !== undefined ? closingNote_es  : service.closingNote_es;
    service.closingNote_en  = closingNote_en  !== undefined ? closingNote_en  : service.closingNote_en;
    service.featured        = featured !== undefined ? featured === 'true' : service.featured;
    service.order           = order !== undefined ? parseInt(order) : service.order;

    if (imageFile) {
      if (service.image?.publicId) await deleteFile(service.image.publicId);
      service.image = { url: imageFile.path, publicId: imageFile.filename };
    }

    if (galleryFiles.length > 0) {
      const newPhotos = galleryFiles.map(f => ({ url: f.path, publicId: f.filename }));
      service.gallery = [...(service.gallery || []), ...newPhotos];
    }

    await service.save();
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteGalleryImage = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Not found' });

    const idx = parseInt(req.params.idx);
    if (isNaN(idx) || idx < 0 || idx >= service.gallery.length)
      return res.status(400).json({ success: false, message: 'Invalid index' });

    const [removed] = service.gallery.splice(idx, 1);
    if (removed?.publicId) await deleteFile(removed.publicId);

    await service.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Not found' });

    if (service.image?.publicId) await deleteFile(service.image.publicId);
    for (const g of (service.gallery || [])) {
      if (g.publicId) await deleteFile(g.publicId);
    }
    await service.deleteOne();

    res.json({ success: true, message: 'Service deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
