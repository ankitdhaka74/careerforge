
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },

    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: true,
    },

    status: {
      type: String,
      enum: [
        'Applied',
        'Under Review',
        'Shortlisted',
        'Interview',
        'Selected',
        'Rejected',
        'Withdrawn',
      ],
      default: 'Applied',
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// One application per student per opportunity.
applicationSchema.index(
  { student: 1, opportunity: 1 },
  { unique: true }
);

module.exports = mongoose.model('Application', applicationSchema);
