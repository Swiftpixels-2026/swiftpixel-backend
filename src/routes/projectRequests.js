const express = require('express');
const router = express.Router();
const ProjectRequest = require('../models/ProjectRequest');
const { sendAdminNotification, sendConfirmation } = require('../services/emailService');
const { projectRequestAdmin, projectRequestConfirmation } = require('../services/emailTemplates');
const adminAuth = require('../middleware/adminAuth');

// ─── PUBLIC: Submit ───────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const {
    name, email, company, phone,
    projectType, budget, timeline,
    description, goals, targetAudience,
  } = req.body;

  if (!name || !email || !projectType || !budget) {
    return res.status(400).json({ error: 'name, email, projectType, and budget are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    const record = await ProjectRequest.create({
      name, email, company, phone,
      projectType, budget, timeline,
      description, goals, targetAudience,
    });

    const data = record.toObject();
    await sendAdminNotification(`📋 New Project Request from ${name}`, projectRequestAdmin(data));
    await sendConfirmation(email, 'We received your project request — SwiftPixels Studio', projectRequestConfirmation(data));

    res.status(201).json({ success: true, message: 'Project request submitted successfully.' });
  } catch (err) {
    console.error('Project request error:', err);
    res.status(500).json({ error: 'Failed to submit. Please try again.' });
  }
});

// ─── ADMIN: List (with optional ?status= and ?page= filters) ─────────────────
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [records, total] = await Promise.all([
      ProjectRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      ProjectRequest.countDocuments(filter),
    ]);
    res.json({ data: records, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records.' });
  }
});

// ─── ADMIN: Get one ───────────────────────────────────────────────────────────
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const record = await ProjectRequest.findById(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found.' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch record.' });
  }
});

// ─── ADMIN: Update status / internal notes ───────────────────────────────────
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const allowed = ['status', 'notes'];
    const updates = {};
    allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

    const record = await ProjectRequest.findByIdAndUpdate(
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
    const record = await ProjectRequest.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found.' });
    res.json({ success: true, message: 'Record deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete record.' });
  }
});

module.exports = router;
