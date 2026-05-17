const mongoose = require('mongoose');

const growtivaEventSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    note:  { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', growtivaEventSchema);
