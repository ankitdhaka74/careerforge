
const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

// A student can save each opportunity only once.
savedJobSchema.index(
  { student: 1, opportunity: 1 },
  { unique: true }
);

module.exports = mongoose.model('SavedJob', savedJobSchema);
