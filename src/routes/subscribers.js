const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
const { sendAdminNotification, sendConfirmation } = require('../services/emailService');
const { subscriberAdmin, subscriberConfirmation } = require('../services/emailTemplates');
const adminAuth = require('../middleware/adminAuth');

// ─── PUBLIC: Subscribe ────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { email, name } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.active) return res.status(409).json({ error: 'This email is already subscribed.' });
      // Re-activate if they had unsubscribed
      existing.active = true;
      await existing.save();
      return res.json({ success: true, message: 'Welcome back! You have been re-subscribed.' });
    }

    const record = await Subscriber.create({ email, name });
    const data = record.toObject();

    await sendAdminNotification(`🔔 New Subscriber: ${email}`, subscriberAdmin(data));
    await sendConfirmation(email, 'Welcome to SwiftPixels Studio! 🎉', subscriberConfirmation(data));

    res.status(201).json({ success: true, message: 'Subscribed successfully.' });
  } catch (err) {
    console.error('Subscriber error:', err);
    res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
  }
});

// ─── ADMIN: List ──────────────────────────────────────────────────────────────
router.get('/', adminAuth, async (req, res) => {
  try {
    const { active, page = 1, limit = 20 } = req.query;
    const filter = active !== undefined ? { active: active === 'true' } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [records, total] = await Promise.all([
      Subscriber.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Subscriber.countDocuments(filter),
    ]);
    res.json({ data: records, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records.' });
  }
});

// ─── ADMIN: Get one ───────────────────────────────────────────────────────────
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const record = await Subscriber.findById(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found.' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch record.' });
  }
});

// ─── ADMIN: Update (toggle active, update name) ───────────────────────────────
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const allowed = ['active', 'name'];
    const updates = {};
    allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

    const record = await Subscriber.findByIdAndUpdate(
      req.params.id, { $set: updates }, { new: true, runValidators: true }
    );
    if (!record) return res.status(404).json({ error: 'Not found.' });
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update record.' });
  }
});

// ─── ADMIN: Delete ────────────────────────────────────────────────────────────
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const record = await Subscriber.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found.' });
    res.json({ success: true, message: 'Subscriber deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete record.' });
  }
});

module.exports = router;
