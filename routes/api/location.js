const express = require('express');
const router = express.Router();
const { getLocation, updateLocation } = require('../../controllers/locationController');
const { protectAPI } = require('../../middleware/auth');

router.get('/',   getLocation);
router.put('/',   protectAPI, updateLocation);

module.exports = router;
