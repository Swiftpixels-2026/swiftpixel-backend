const mongoose = require('mongoose');

const grootivaSubscriberSchema = new mongoose.Schema(
  {
    email:  { type: String, required: true, unique: true, trim: true, lowercase: true },
    name:   { type: String, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GrootivaSubscriber', grootivaSubscriberSchema);
