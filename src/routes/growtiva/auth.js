const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/env');

// Admin passkey from user request
const ADMIN_PASSKEY = "Systemoverhustle";

// ─── POST: Login ──────────────────────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { passkey } = req.body;

  if (!passkey) {
    return res.status(400).json({ error: 'Passkey is required.' });
  }

  if (passkey !== ADMIN_PASSKEY) {
    return res.status(401).json({ error: 'Invalid passkey.' });
  }

  // Create token
  const token = jwt.sign(
    { role: 'admin', site: 'growtiva' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    token,
    message: 'Logged in successfully.'
  });
});

// ─── POST: Logout ─────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  // In a stateless JWT setup, logout is usually handled on the client 
  // (by deleting the token). We'll just return a success message.
  res.json({ success: true, message: 'Logged out successfully.' });
});

module.exports = router;
