const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    city:     { type: String, required: true, trim: true },
    country:  { type: String, required: true, trim: true },
    blurb:    { type: String, required: true, trim: true },
    services: { type: String, required: true, trim: true },
    email:    { type: String, required: true, trim: true, lowercase: true },
    phone:    { type: String, required: true, trim: true },
    url:      { type: String, trim: true },
    image:    { type: String, trim: true },
    tags:     [{ type: String, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Listing', listingSchema);
