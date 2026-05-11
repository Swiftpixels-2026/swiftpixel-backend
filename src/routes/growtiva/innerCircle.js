const express = require('express');
const router = express.Router();
const InnerCircle = require('../../models/growtiva/InnerCircle');
const { sendAdminNotification, sendConfirmation } = require('../../services/emailService');
const { innerCircleAdmin, innerCircleConfirmation } = require('../../services/growtiva/emailTemplates');
const adminAuth = require('../../middleware/adminAuth');
const { GROWTIVA_EMAIL_TO } = require('../../config/env');

// ─── PUBLIC: Submit ───────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { name, email, role, city, why } = req.body;

  if (!name || !email || !role || !city || !why) {
    return res.status(400).json({ error: 'All fields (name, email, role, city, why) are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    const record = await InnerCircle.create({ name, email, role, city, why });
    const data = record.toObject();

    await sendAdminNotification(`⭕ New Inner Circle App: ${name}`, innerCircleAdmin(data), GROWTIVA_EMAIL_TO, 'growtiva');
    await sendConfirmation(email, 'Application received — Growtiva Inner Circle', innerCircleConfirmation(data), 'growtiva');

    res.status(201).json({ success: true, message: 'Application submitted successfully.' });
  } catch (err) {
    console.error('Growtiva inner circle error:', err);
    res.status(500).json({ error: 'Failed to submit. Please try again.' });
  }
});

// ─── ADMIN: List ──────────────────────────────────────────────────────────────
router.get('/', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [records, total] = await Promise.all([
      InnerCircle.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      InnerCircle.countDocuments(),
    ]);
    res.json({ data: records, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records.' });
  }
});

// ─── ADMIN: Delete ────────────────────────────────────────────────────────────
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const record = await InnerCircle.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found.' });
    res.json({ success: true, message: 'Application deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete record.' });
  }
});

module.exports = router;
