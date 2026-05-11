const express = require('express');
const router = express.Router();
const Listing = require('../../models/growtiva/Listing');
const adminAuth = require('../../middleware/adminAuth');

// ─── PUBLIC: Get all unique tags ──────────────────────────────────────────────
router.get('/tags', async (req, res) => {
  try {
    const tags = await Listing.distinct('tags');
    res.json({ success: true, data: tags });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tags.' });
  }
});

// ─── PUBLIC: List Listings ───────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, city, tags, search } = req.query;
    const query = {};

    // Filter by category
    if (category) query.category = category;
    
    // Filter by city
    if (city) query.city = city;

    // Filter by tags (can be a comma-separated string or array)
    if (tags) {
      const tagList = Array.isArray(tags) ? tags : tags.split(',');
      query.tags = { $all: tagList };
    }

    // Search by name, category, or city
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { category: searchRegex },
        { city: searchRegex }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [records, total] = await Promise.all([
      Listing.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Listing.countDocuments(query),
    ]);
    
    res.json({ data: records, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error('Listings fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch listings.' });
  }
});

// ─── PUBLIC: Get one ───────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const record = await Listing.findById(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found.' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listing.' });
  }
});

// ─── ADMIN: Create ────────────────────────────────────────────────────────────
router.post('/', adminAuth, async (req, res) => {
  const { name, category, city, country, blurb, services, email, phone, url, image, tags } = req.body;

  if (!name || !category || !city || !country || !blurb || !services || !email || !phone) {
    return res.status(400).json({ error: 'Required fields missing.' });
  }

  try {
    const listing = await Listing.create({
      name, category, city, country, blurb, services, email, phone, url, image, tags
    });
    res.status(201).json({ success: true, data: listing });
  } catch (err) {
    console.error('Growtiva listing creation error:', err);
    res.status(500).json({ error: 'Failed to create listing.' });
  }
});

// ─── ADMIN: Update ────────────────────────────────────────────────────────────
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const allowed = ['name', 'category', 'city', 'country', 'blurb', 'services', 'email', 'phone', 'url', 'image', 'tags'];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const record = await Listing.findByIdAndUpdate(
      req.params.id, { $set: updates }, { new: true, runValidators: true }
    );
    if (!record) return res.status(404).json({ error: 'Not found.' });
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update listing.' });
  }
});

// ─── ADMIN: Delete ────────────────────────────────────────────────────────────
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const record = await Listing.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found.' });
    res.json({ success: true, message: 'Listing deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete listing.' });
  }
});

module.exports = router;
