/* ============================================
   DATABASE CONFIG
   Purpose: MongoDB connection via Mongoose
   ============================================ */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas
 */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
