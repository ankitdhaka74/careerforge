
const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    university: {
      type: String,
      default: '',
      trim: true,
    },
    branch: {
      type: String,
      default: '',
      trim: true,
    },
    graduationYear: {
      type: Number,
      default: null,
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },
    skills: {
      type: [String],
      default: [],
    },
    careerGoal: {
      type: String,
      default: 'Software Developer',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Student', studentSchema)
