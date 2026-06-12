/* ============================================
   CLOUDINARY SERVICE
   Purpose: Configure Cloudinary + multer upload middleware
   ============================================ */

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Build a multer-cloudinary upload middleware for a given folder
 * @param {string} folder - Cloudinary folder name
 * @returns {multer instance}
 */
function buildUploader(folder) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `dreyes-delicias/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }]
    }
  });

  return multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
  });
}

/**
 * Delete a file from Cloudinary by publicId
 * @param {string} publicId
 */
async function deleteFile(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error.message);
  }
}

const menuUploader    = buildUploader('menu');
const galleryUploader = buildUploader('gallery');

// Handles cover image + gallery for menu items
const menuMultiUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'dreyes-delicias/menu',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }]
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 }
}).fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]);

// Handles both cover image (single) + gallery (multiple) for services
const serviceMultiUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'dreyes-delicias/services',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }]
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 }
}).fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]);

const allyUploader = buildUploader('allies');

module.exports = { cloudinary, menuUploader, menuMultiUploader, serviceMultiUploader, galleryUploader, allyUploader, deleteFile };
