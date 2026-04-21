const express = require("express");
const router = express.Router();
const Profile = require("../../models/growtiva/Profile");
const {
  sendAdminNotification,
  sendConfirmation,
} = require("../../services/emailService");
const {
  profileAdmin,
  profileConfirmation,
} = require("../../services/growtiva/emailTemplates");
const adminAuth = require("../../middleware/adminAuth");
const { GROWTIVA_EMAIL_TO } = require("../../config/env");

// ─── PUBLIC: Submit ───────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  const { full_name, phone, email } = req.body;

  if (!full_name || !phone || !email) {
    return res
      .status(400)
      .json({ error: "full_name, phone, and email are required." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  try {
    const record = await Profile.create({ fullName: full_name, phone, email });
    const data = record.toObject();

    await sendAdminNotification(
      `👤 New Profile from ${full_name}`,
      profileAdmin(data),
      GROWTIVA_EMAIL_TO,
    );
    await sendConfirmation(
      email,
      "Profile received — Growtiva",
      profileConfirmation(data),
    );

    res
      .status(201)
      .json({ success: true, message: "Profile submitted successfully." });
  } catch (err) {
    console.error("Growtiva profile error:", err);
    res.status(500).json({ error: "Failed to submit. Please try again." });
  }
});

// ─── ADMIN: List ──────────────────────────────────────────────────────────────
router.get("/", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [records, total] = await Promise.all([
      Profile.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Profile.countDocuments(),
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
    const record = await Profile.findById(req.params.id);
    if (!record) return res.status(404).json({ error: "Not found." });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch record." });
  }
});

// ─── ADMIN: Update ────────────────────────────────────────────────────────────
router.patch("/:id", adminAuth, async (req, res) => {
  try {
    const allowed = ["fullName", "phone", "email"];
    const updates = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    const record = await Profile.findByIdAndUpdate(
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
    const record = await Profile.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: "Not found." });
    res.json({ success: true, message: "Profile deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete record." });
  }
});

module.exports = router;
