const express = require("express");
const router = express.Router();
const ContactMessage = require("../../models/growtiva/ContactMessage");
const {
  sendAdminNotification,
  sendConfirmation,
} = require("../../services/emailService");
const {
  contactAdmin,
  contactConfirmation,
} = require("../../services/growtiva/emailTemplates");
const adminAuth = require("../../middleware/adminAuth");
const { GROWTIVA_EMAIL_TO } = require("../../config/env");

// ─── PUBLIC: Submit ───────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "name, email, and message are required." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }
  if (message.length > 2000) {
    return res
      .status(400)
      .json({ error: "Message too long (max 2000 characters)." });
  }

  try {
    const record = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });
    const data = record.toObject();

    await sendAdminNotification(
      `✉️ New Growtiva Contact from ${name}`,
      contactAdmin(data),
      GROWTIVA_EMAIL_TO,
    );
    await sendConfirmation(
      email,
      "We got your message — Growtiva",
      contactConfirmation(data),
    );

    res
      .status(201)
      .json({ success: true, message: "Message sent successfully." });
  } catch (err) {
    console.error("Growtiva contact error:", err);
    res.status(500).json({ error: "Failed to submit. Please try again." });
  }
});

// ─── ADMIN: List ──────────────────────────────────────────────────────────────
router.get("/", adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [records, total] = await Promise.all([
      ContactMessage.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      ContactMessage.countDocuments(filter),
    ]);
    res.json({
      data: records,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch records." });
  }
});

// ─── ADMIN: Get one ───────────────────────────────────────────────────────────
router.get("/:id", adminAuth, async (req, res) => {
  try {
    const record = await ContactMessage.findById(req.params.id);
    if (!record) return res.status(404).json({ error: "Not found." });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch record." });
  }
});

// ─── ADMIN: Update ────────────────────────────────────────────────────────────
router.patch("/:id", adminAuth, async (req, res) => {
  try {
    const allowed = ["status", "adminNotes"];
    const updates = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    const record = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    );
    if (!record) return res.status(404).json({ error: "Not found." });
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ error: "Failed to update record." });
  }
});

// ─── ADMIN: Delete ────────────────────────────────────────────────────────────
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const record = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: "Not found." });
    res.json({ success: true, message: "Message deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete record." });
  }
});

module.exports = router;
