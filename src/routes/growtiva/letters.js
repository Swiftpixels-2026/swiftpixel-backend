const express = require('express');
const router = express.Router();
const Letter = require('../../models/growtiva/Letter');
const adminAuth = require('../../middleware/adminAuth');

// ─── PUBLIC: Submit Letter (POST) ───────────────────────────────────────────
router.post('/', async (req, res) => {
  const { name, email, city, subject, body } = req.body;

  if (!name || !email || !body) {
    return res.status(400).json({ error: 'Name, email, and body are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    const record = await Letter.create({ name, email, city, subject, body });
    res.status(201).json({ success: true, message: 'Letter submitted successfully.' });
  } catch (err) {
    console.error('Growtiva letter error:', err);
    res.status(500).json({ error: 'Failed to submit letter. Please try again.' });
  }
});

// ─── ADMIN: List Letters (GET) ──────────────────────────────────────────────
router.get('/', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [records, total] = await Promise.all([
      Letter.find({}).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Letter.countDocuments({}),
    ]);
    res.json({ data: records, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records.' });
  }
});

// ─── ADMIN: Delete Letter (DELETE) ─────────────────────────────────────────
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const record = await Letter.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found.' });
    res.json({ success: true, message: 'Letter deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete record.' });
  }
});

module.exports = router;
