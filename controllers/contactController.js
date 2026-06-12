/* ============================================
   CONTACT CONTROLLER
   Purpose: Save message to DB + send email notification
   ============================================ */

const Message = require('../models/Message');
const { sendContactNotification } = require('../services/emailService');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    await Message.create({ name, email, phone: phone || '', subject: subject || '', message });

    try {
      await sendContactNotification({ name, email, phone, subject, message });
    } catch (emailErr) {
      console.error('Email send failed (message saved):', emailErr.message);
    }

    res.json({ success: true, message: 'Message received' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
