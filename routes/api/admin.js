const express = require('express');
const router = express.Router();
const { login, logout } = require('../../controllers/adminController');
const { protectAPI } = require('../../middleware/auth');

router.post('/login', login);
router.post('/logout', protectAPI, logout);

module.exports = router;
