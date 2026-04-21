const express = require('express');
const router = express.Router();
const CallRequest = require('../models/CallRequest');
const { sendAdminNotification, sendConfirmation } = require('../services/emailService');
const { callRequestAdmin, callRequestConfirmation } = require('../services/emailTemplates');
const adminAuth = require('../middleware/adminAuth');

// ─── PUBLIC: Submit ───────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  // Accept both camelCase and snake_case from frontend
  const name          = req.body.name;
  const email         = req.body.email;
  const phone         = req.body.phone;
  const topic         = req.body.topic;
  const notes         = req.body.notes;
  const preferredDate = req.body.preferred_date || req.body.preferredDate;
  const preferredTime = req.body.preferred_time || req.body.preferredTime;

  if (!name || !email || !preferredDate || !preferredTime) {
    return res.status(400).json({ error: 'name, email, preferred_date, and preferred_time are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    const record = await CallRequest.create({ name, email, phone, topic, notes, preferredDate, preferredTime });
    const data = record.toObject();

    await sendAdminNotification(`📞 New Call Request from ${name}`, callRequestAdmin(data));
    await sendConfirmation(email, 'Your call request — SwiftPixels Studio', callRequestConfirmation(data));

    res.status(201).json({ success: true, message: 'Call request submitted successfully.' });
  } catch (err) {
    console.error('Call request error:', err);
    res.status(500).json({ error: 'Failed to submit. Please try again.' });
  }
});

// ─── ADMIN: List ──────────────────────────────────────────────────────────────
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [records, total] = await Promise.all([
      CallRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      CallRequest.countDocuments(filter),
    ]);
    res.json({ data: records, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records.' });
  }
});

// ─── ADMIN: Get one ───────────────────────────────────────────────────────────
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const record = await CallRequest.findById(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found.' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch record.' });
  }
});

// ─── ADMIN: Update ────────────────────────────────────────────────────────────
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const allowed = ['status', 'adminNotes', 'preferredDate', 'preferredTime'];
    const updates = {};
    allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

    const record = await CallRequest.findByIdAndUpdate(
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
    const record = await CallRequest.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found.' });
    res.json({ success: true, message: 'Record deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete record.' });
  }
});

module.exports = router;
