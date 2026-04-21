const { ADMIN_SECRET } = require('../config/env');

/**
 * Simple secret-key auth for admin CRUD routes.
 * Pass header:  x-admin-secret: <your ADMIN_SECRET>
 */
function adminAuth(req, res, next) {
  const secret = req.headers['x-admin-secret'];
  if (!secret || secret !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

module.exports = adminAuth;
