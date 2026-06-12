const express = require('express');
const router = express.Router();
const { getItems, getItem, createItem, updateItem, deleteItem, deleteGalleryImage, reorderItems } = require('../../controllers/menuController');
const { protectAPI } = require('../../middleware/auth');
const { menuMultiUploader } = require('../../services/cloudinaryService');

router.get('/',                      getItems);
router.get('/:id',                   getItem);
router.post('/',                     protectAPI, menuMultiUploader, createItem);
router.put('/reorder/batch',         protectAPI, reorderItems);
router.put('/:id',                   protectAPI, menuMultiUploader, updateItem);
router.delete('/:id/gallery/:idx',   protectAPI, deleteGalleryImage);
router.delete('/:id',                protectAPI, deleteItem);

module.exports = router;
