const express = require('express');
const router = express.Router();
const { getMessages, markRead, markAllRead, deleteMessage } = require('../../controllers/messageController');
const { protectAPI } = require('../../middleware/auth');

router.get('/',              protectAPI, getMessages);
router.put('/mark-all-read', protectAPI, markAllRead);
router.put('/:id',           protectAPI, markRead);
router.delete('/:id',        protectAPI, deleteMessage);

module.exports = router;
