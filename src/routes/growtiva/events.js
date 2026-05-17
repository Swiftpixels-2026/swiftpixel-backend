const express = require('express');
const router = express.Router();
const Event = require('../../models/growtiva/Event');
const adminAuth = require('../../middleware/adminAuth');

// ─── PUBLIC: Submit Event RSVP (POST) ──────────────────────────────────────
router.post('/', async (req, res) => {
  const { name, email, title, note } = req.body;

  if (!name || !email || !title) {
    return res.status(400).json({ error: 'Name, email, and title are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    const record = await Event.create({ name, email, title, note });
    res.status(201).json({ success: true, message: 'RSVP submitted successfully.' });
  } catch (err) {
    console.error('Growtiva event rsvp error:', err);
    res.status(500).json({ error: 'Failed to submit RSVP. Please try again.' });
  }
});

// ─── ADMIN: List Event RSVPs (GET) ─────────────────────────────────────────
router.get('/', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [records, total] = await Promise.all([
      Event.find({}).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Event.countDocuments({}),
    ]);
    res.json({ data: records, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records.' });
  }
});

// ─── ADMIN: Delete Event RSVP (DELETE) ──────────────────────────────────────
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const record = await Event.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found.' });
    res.json({ success: true, message: 'RSVP deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete record.' });
  }
});

module.exports = router;
