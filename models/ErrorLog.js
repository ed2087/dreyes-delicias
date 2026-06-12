/* ============================================
   ERROR LOG MODEL
   Purpose: Persist server errors to database
   ============================================ */

const mongoose = require('mongoose');

const errorLogSchema = new mongoose.Schema({
  message: String,
  stack: String,
  url: String,
  method: String,
  ip: String,
  userAgent: String,
  userId: { type: mongoose.Schema.Types.ObjectId, default: null },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ErrorLog', errorLogSchema);
