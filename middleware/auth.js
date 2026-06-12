/* ============================================
   AUTH MIDDLEWARE
   Purpose: Protect admin view and API routes
   ============================================ */

const tokenService = require('../services/tokenService');
const Admin = require('../models/Admin');

/**
 * Protect admin view routes — redirect to login if not authenticated
 */
const protect = async (req, res, next) => {
  const token = req.cookies.adminToken;

  if (!token) return res.redirect('/admin/login');

  try {
    const decoded = tokenService.verifyToken(token);
    if (!decoded) return res.redirect('/admin/login');

    req.admin = await Admin.findById(decoded.adminId);
    if (!req.admin) return res.redirect('/admin/login');

    next();
  } catch (error) {
    return res.redirect('/admin/login');
  }
};

/**
 * Protect admin API routes — return JSON 401 if not authenticated
 */
const protectAPI = async (req, res, next) => {
  const token = req.cookies.adminToken;

  if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

  try {
    const decoded = tokenService.verifyToken(token);
    if (!decoded) return res.status(401).json({ success: false, message: 'Invalid token' });

    req.admin = await Admin.findById(decoded.adminId);
    if (!req.admin) return res.status(401).json({ success: false, message: 'Admin not found' });

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

/**
 * CSRF protection — require X-Requested-With on state-changing requests
 */
const csrfProtect = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  if (req.headers['x-requested-with'] !== 'XMLHttpRequest') {
    return res.status(403).json({ success: false, message: 'Invalid request origin' });
  }

  next();
};

module.exports = { protect, protectAPI, csrfProtect };
