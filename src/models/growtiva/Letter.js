const mongoose = require('mongoose');

const growtivaLetterSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, trim: true, lowercase: true },
    city:    { type: String, trim: true },
    subject: { type: String, trim: true },
    body:    { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Letter', growtivaLetterSchema);
