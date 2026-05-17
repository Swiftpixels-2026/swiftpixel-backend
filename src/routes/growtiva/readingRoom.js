const express = require('express');
const router = express.Router();
const ReadingRoom = require('../../models/growtiva/ReadingRoom');
const { sendAdminNotification, sendConfirmation } = require('../../services/emailService');
const { readingRoomAdmin, readingRoomConfirmation } = require('../../services/growtiva/emailTemplates');
const adminAuth = require('../../middleware/adminAuth');
const { GROWTIVA_EMAIL_TO } = require('../../config/env');

// ─── PUBLIC: Join Reading Room (POST) ───────────────────────────────────────
router.post('/', async (req, res) => {
  const { email, name } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    const existing = await ReadingRoom.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.active) return res.status(409).json({ error: 'This email has already joined the reading room.' });
      existing.active = true;
      await existing.save();
      return res.json({ success: true, message: 'Welcome back! You have rejoined the reading room.' });
    }

    const record = await ReadingRoom.create({ email, name });
    const data = record.toObject();

    // Send notifications/confirmations similar to Subscriber flow
    await sendAdminNotification(`📚 New Growtiva Reading Room Member: ${email}`, readingRoomAdmin(data), GROWTIVA_EMAIL_TO, 'growtiva');
    await sendConfirmation(email, 'Welcome to the Growtiva Reading Room! 📚', readingRoomConfirmation(), 'growtiva');

    res.status(201).json({ success: true, message: 'Joined the reading room successfully.' });
  } catch (err) {
    console.error('Growtiva reading room error:', err);
    res.status(500).json({ error: 'Failed to join. Please try again.' });
  }
});

// ─── ADMIN: List Reading Room Members (GET) ──────────────────────────────────
router.get('/', adminAuth, async (req, res) => {
  try {
    const { active, page = 1, limit = 20 } = req.query;
    const filter = active !== undefined ? { active: active === 'true' } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [records, total] = await Promise.all([
      ReadingRoom.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      ReadingRoom.countDocuments(filter),
    ]);
    res.json({ data: records, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records.' });
  }
});

// ─── ADMIN: Delete Reading Room Member (DELETE) ──────────────────────────────
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const record = await ReadingRoom.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found.' });
    res.json({ success: true, message: 'Reading room member deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete record.' });
  }
});

module.exports = router;
