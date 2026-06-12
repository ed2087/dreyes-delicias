const express = require('express');
const router = express.Router();
const {
  getServices, getService, createService, updateService,
  deleteService, deleteGalleryImage
} = require('../../controllers/serviceController');
const { protectAPI } = require('../../middleware/auth');
const { serviceMultiUploader } = require('../../services/cloudinaryService');

router.get('/',                         getServices);
router.get('/:id',                      getService);
router.post('/',                        protectAPI, serviceMultiUploader, createService);
router.put('/:id',                      protectAPI, serviceMultiUploader, updateService);
router.delete('/:id/gallery/:idx',      protectAPI, deleteGalleryImage);
router.delete('/:id',                   protectAPI, deleteService);

module.exports = router;
