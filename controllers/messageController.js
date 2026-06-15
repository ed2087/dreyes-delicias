/* ============================================
   MESSAGE CONTROLLER
   Purpose: Admin-only — list, mark read, delete messages
   ============================================ */

const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
  try {
    const filter = {};
    if (req.query.unread === 'true') filter.read = false;

    const messages = await Message.find(filter).sort({ createdAt: -1 });
    const unreadCount = await Message.countDocuments({ read: false });

    res.json({ success: true, messages, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.markRead = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Not found' });
    msg.read = req.body.hasOwnProperty('read') ? !!req.body.read : !msg.read;
    await msg.save();
    res.json({ success: true, message: msg });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Message.updateMany({ read: false }, { read: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Not found' });
    await msg.deleteOne();
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
