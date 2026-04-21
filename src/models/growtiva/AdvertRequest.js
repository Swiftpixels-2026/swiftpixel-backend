const mongoose = require('mongoose');

const advertRequestSchema = new mongoose.Schema(
  {
    fullName:          { type: String, required: true, trim: true },
    email:             { type: String, required: true, trim: true, lowercase: true },
    businessName:      { type: String, required: true, trim: true },
    adType:            { type: String, required: true },
    budget:            { type: String, required: true },
    wantHardCopy:      { type: Boolean, default: false },
    additionalDetails: { type: String },
    status: {
      type: String,
      enum: ['new', 'reviewing', 'quoted', 'accepted', 'rejected'],
      default: 'new',
    },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdvertRequest', advertRequestSchema);
