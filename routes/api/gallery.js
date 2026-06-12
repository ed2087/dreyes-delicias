const express = require('express');
const router = express.Router();
const { getPhotos, uploadPhotos, updatePhoto, deletePhoto, reorderPhotos } = require('../../controllers/galleryController');
const { protectAPI } = require('../../middleware/auth');
const { galleryUploader } = require('../../services/cloudinaryService');

router.get('/',              getPhotos);
router.post('/',             protectAPI, galleryUploader.array('photos', 20), uploadPhotos);
router.put('/reorder/batch', protectAPI, reorderPhotos);
router.put('/:id',           protectAPI, updatePhoto);
router.delete('/:id',        protectAPI, deletePhoto);

module.exports = router;
