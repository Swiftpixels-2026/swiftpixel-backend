const mongoose = require('mongoose');

const callRequestSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    email:         { type: String, required: true, trim: true, lowercase: true },
    phone:         { type: String, trim: true },
    topic:         { type: String },
    notes:         { type: String },
    preferredDate: { type: String, required: true },
    preferredTime: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'confirmed', 'completed', 'cancelled'],
      default: 'new',
    },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CallRequest', callRequestSchema);
