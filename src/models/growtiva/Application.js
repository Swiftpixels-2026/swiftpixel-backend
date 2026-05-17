const mongoose = require('mongoose');

const growtivaApplicationSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, trim: true, lowercase: true },
    business: { type: String, trim: true },
    category: { type: String, trim: true },
    city:     { type: String, trim: true },
    note:     { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', growtivaApplicationSchema);
