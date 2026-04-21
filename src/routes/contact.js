const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { sendAdminNotification, sendConfirmation } = require('../services/emailService');
const { contactAdmin, contactConfirmation } = require('../services/emailTemplates');
const adminAuth = require('../middleware/adminAuth');

// ─── PUBLIC: Submit ───────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { firstName, lastName, email, phone, projectType, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: 'firstName, lastName, email, and message are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }
  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message is too long (max 2000 characters).' });
  }

  try {
    const record = await Contact.create({ firstName, lastName, email, phone, projectType, message });
    const data = record.toObject();

    await sendAdminNotification(`✉️ New Contact from ${firstName} ${lastName}`, contactAdmin(data));
    await sendConfirmation(email, "We got your message — SwiftPixels Studio", contactConfirmation(data));

    res.status(201).json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Contact error:', err);
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
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Contact.countDocuments(filter),
    ]);
    res.json({ data: records, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records.' });
  }
});

// ─── ADMIN: Get one ───────────────────────────────────────────────────────────
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const record = await Contact.findById(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found.' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch record.' });
  }
});

// ─── ADMIN: Update ────────────────────────────────────────────────────────────
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const allowed = ['status', 'adminNotes'];
    const updates = {};
    allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

    const record = await Contact.findByIdAndUpdate(
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
    const record = await Contact.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found.' });
    res.json({ success: true, message: 'Record deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete record.' });
  }
});

module.exports = router;
