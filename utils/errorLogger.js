/* ============================================
   ERROR LOGGER
   Purpose: Log errors to console, file, and database
   ============================================ */

const fs = require('fs').promises;
const path = require('path');
const ErrorLog = require('../models/ErrorLog');

/**
 * Log error to console, file, and MongoDB
 * @param {Error} err
 * @param {Object} req - Express request (optional)
 */
async function logError(err, req = {}) {
  const errorData = {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl || 'N/A',
    method: req.method || 'N/A',
    ip: req.ip || 'N/A',
    userAgent: req.headers?.['user-agent'] || 'N/A',
    userId: req.admin?._id || null,
    timestamp: new Date().toISOString()
  };

  console.error('\n========================================');
  console.error('ERROR:', err.message);
  console.error('URL:', errorData.url);
  console.error('========================================\n');

  try {
    const logDir = path.join(__dirname, '../logs');
    await fs.mkdir(logDir, { recursive: true });
    const logFile = path.join(logDir, `error-${new Date().toISOString().split('T')[0]}.log`);
    await fs.appendFile(logFile, `\n[${errorData.timestamp}]\n${JSON.stringify(errorData, null, 2)}\n`);
  } catch (fileError) {
    console.error('Failed to write error log file:', fileError);
  }

  try {
    await ErrorLog.create(errorData);
  } catch (dbError) {
    console.error('Failed to log error to DB:', dbError);
  }
}

module.exports = { logError };
