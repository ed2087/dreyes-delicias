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
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!message) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message });
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
