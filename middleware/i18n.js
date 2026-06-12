/* ============================================
   I18N MIDDLEWARE
   Purpose: Attach language preference and translations to every request
   ============================================ */

const es = require('../locales/es.json');
const en = require('../locales/en.json');

const LOCALES = { es, en };

/**
 * Reads lang cookie or defaults to 'es'.
 * Attaches res.locals.lang and res.locals.t (translation object).
 */
function i18n(req, res, next) {
  const lang = (req.cookies.lang === 'en') ? 'en' : 'es';

  res.locals.lang = lang;
  res.locals.t = LOCALES[lang];

  next();
}

module.exports = i18n;
