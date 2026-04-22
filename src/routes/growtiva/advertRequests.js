const express = require("express");
const router = express.Router();
const AdvertRequest = require("../../models/growtiva/AdvertRequest");
const {
  sendAdminNotification,
  sendConfirmation,
} = require("../../services/emailService");
const {
  advertRequestAdmin,
  advertRequestConfirmation,
} = require("../../services/growtiva/emailTemplates");
const adminAuth = require("../../middleware/adminAuth");
const { GROWTIVA_EMAIL_TO } = require("../../config/env");

// ─── PUBLIC: Submit ───────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  const {
    full_name,
    email,
    business_name,
    ad_type,
    budget,
    want_hard_copy,
    additional_details,
  } = req.body;

  if (!full_name || !email || !business_name || !ad_type || !budget) {
    return res.status(400).json({
      error:
        "full_name, email, business_name, ad_type, and budget are required.",
    });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  try {
    const record = await AdvertRequest.create({
      fullName: full_name,
      email,
      businessName: business_name,
      adType: ad_type,
      budget,
      wantHardCopy: want_hard_copy ?? false,
      additionalDetails: additional_details,
    });

    const data = record.toObject();
    await sendAdminNotification(
      `📣 New Advert Request from ${full_name}`,
      advertRequestAdmin(data),
      GROWTIVA_EMAIL_TO,
      "growtiva",
    );
    await sendConfirmation(
      email,
      "We received your advert request — Growtiva",
      advertRequestConfirmation(data),
      "growtiva",
    );

    res
      .status(201)
      .json({
        success: true,
        message: "Advert request submitted successfully.",
      });
  } catch (err) {
    console.error("Growtiva advert request error:", err);
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
      AdvertRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      AdvertRequest.countDocuments(filter),
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
    const record = await AdvertRequest.findById(req.params.id);
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

    const record = await AdvertRequest.findByIdAndUpdate(
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
    const record = await AdvertRequest.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: "Not found." });
    res.json({ success: true, message: "Record deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete record." });
  }
});

module.exports = router;
