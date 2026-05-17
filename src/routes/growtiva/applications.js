const express = require('express');
const router = express.Router();
const Application = require('../../models/growtiva/Application');
const adminAuth = require('../../middleware/adminAuth');

// ─── PUBLIC: Submit Application (POST) ──────────────────────────────────────
router.post('/', async (req, res) => {
  const { name, email, business, category, city, note } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    const record = await Application.create({ name, email, business, category, city, note });
    res.status(201).json({ success: true, message: 'Application submitted successfully.' });
  } catch (err) {
    console.error('Growtiva application error:', err);
    res.status(500).json({ error: 'Failed to submit application. Please try again.' });
  }
});

// ─── ADMIN: List Applications (GET) ─────────────────────────────────────────
router.get('/', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [records, total] = await Promise.all([
      Application.find({}).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Application.countDocuments({}),
    ]);
    res.json({ data: records, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records.' });
  }
});

// ─── ADMIN: Delete Application (DELETE) ──────────────────────────────────────
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const record = await Application.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found.' });
    res.json({ success: true, message: 'Application deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete record.' });
  }
});

module.exports = router;
