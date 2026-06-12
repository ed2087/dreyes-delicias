/* ============================================
   HELPERS
   Purpose: Shared utility functions
   ============================================ */

const slugify = require('slugify');

/**
 * Generate a URL-safe slug from a string
 * @param {string} text
 * @returns {string}
 */
exports.createSlug = (text) => {
  return slugify(text, { lower: true, strict: true, locale: 'es' });
};

/**
 * Format price as USD string
 * @param {number} price
 * @returns {string}
 */
exports.formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
};

/**
 * Pick the correct language field from a bilingual object
 * @param {Object} doc - Mongoose document
 * @param {string} field - Base field name (e.g. 'name')
 * @param {string} lang - 'es' or 'en'
 * @returns {string}
 */
exports.getLang = (doc, field, lang = 'es') => {
  return doc[`${field}_${lang}`] || doc[`${field}_es`] || '';
};
