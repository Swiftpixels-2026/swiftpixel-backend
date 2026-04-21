const mongoose = require('mongoose');

const projectRequestSchema = new mongoose.Schema(
  {
    name:           { type: String, required: true, trim: true },
    email:          { type: String, required: true, trim: true, lowercase: true },
    company:        { type: String, trim: true },
    phone:          { type: String, trim: true },
    projectType:    { type: String, required: true },
    budget:         { type: String, required: true },
    timeline:       { type: String },
    description:    { type: String },
    goals:          { type: String },
    targetAudience: { type: String },
    status: {
      type: String,
      enum: ['new', 'reviewing', 'quoted', 'accepted', 'rejected'],
      default: 'new',
    },
    notes: { type: String }, // internal admin notes
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProjectRequest', projectRequestSchema);
