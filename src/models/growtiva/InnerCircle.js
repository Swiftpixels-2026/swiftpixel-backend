const mongoose = require('mongoose');

const innerCircleSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    role:  { type: String, required: true, trim: true },
    city:  { type: String, required: true, trim: true },
    why:   { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InnerCircle', innerCircleSchema);
