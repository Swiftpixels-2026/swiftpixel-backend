const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone:    { type: String, required: true, trim: true },
    email:    { type: String, required: true, trim: true, lowercase: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
