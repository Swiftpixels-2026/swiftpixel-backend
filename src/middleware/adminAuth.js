const jwt = require('jsonwebtoken');
const { ADMIN_SECRET, JWT_SECRET } = require('../config/env');

/**
 * Simple secret-key auth OR JWT token auth for admin CRUD routes.
 * 1. Pass header: x-admin-secret: <your ADMIN_SECRET>
 * 2. OR Pass header: Authorization: Bearer <JWT_TOKEN>
 */
function adminAuth(req, res, next) {
  // Method 1: Secret Key
  const secret = req.headers['x-admin-secret'];
  if (secret && secret === ADMIN_SECRET) {
    return next();
  }

  // Method 2: JWT Token
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.role === 'admin') {
        return next();
      }
    } catch (err) {
      // Token invalid or expired
    }
  }

  return res.status(401).json({ error: 'Unauthorized' });
}

module.exports = adminAuth;
