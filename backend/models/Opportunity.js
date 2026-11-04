
const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    eligibleBranches: {
      type: [String],
      default: [],
    },
    minimumCGPA: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    allowedBacklogs: {
      type: Number,
      default: 0,
      min: 0,
    },
    graduationYear: {
      type: Number,
      default: null,
    },
    location: {
      type: String,
      default: 'Not specified',
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Internship', 'Part-time'],
      default: 'Full-time',
    },
    applicationDeadline: {
      type: Date,
      default: null,
    },
    applicationLink: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  'Opportunity',
  opportunitySchema
);

