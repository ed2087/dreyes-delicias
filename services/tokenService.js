/* ============================================
   TOKEN SERVICE
   Purpose: JWT generate and verify
   ============================================ */

const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for admin session
 * @param {string} adminId
 * @returns {string}
 */
exports.generateToken = (adminId) => {
  return jwt.sign({ adminId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Verify JWT token
 * @param {string} token
 * @returns {Object|null}
 */
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
