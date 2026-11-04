
const express = require('express');
const mongoose = require('mongoose');
const SavedJob = require('../models/SavedJob');
const Opportunity = require('../models/Opportunity');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All saved jobs for the logged-in student
router.get('/', authMiddleware, async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({
      student: req.studentId,
    })
      .populate('opportunity')
      .sort({ createdAt: -1 });

    res.json(savedJobs);
  } catch (error) {
    console.error('Fetch saved jobs:', error.message);
    res.status(500).json({ message: 'Failed to fetch saved jobs' });
  }
});

// Save a job
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { opportunityId } = req.body;

    if (!mongoose.isValidObjectId(opportunityId)) {
      return res.status(400).json({ message: 'Invalid opportunity ID' });
    }

    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    const savedJob = await SavedJob.findOneAndUpdate(
      { student: req.studentId, opportunity: opportunityId },
      {
        $setOnInsert: {
          student: req.studentId,
          opportunity: opportunityId,
        },
      },
      { new: true, upsert: true, runValidators: true }
    ).populate('opportunity');

    res.status(201).json({
      message: 'Job saved successfully',
      savedJob,
    });
  } catch (error) {
    console.error('Save job:', error.message);

    if (error.code === 11000) {
      return res.status(409).json({ message: 'Job already saved' });
    }

    res.status(500).json({ message: 'Failed to save job' });
  }
});

// Remove a saved job
router.delete('/:opportunityId', authMiddleware, async (req, res) => {
  try {
    const { opportunityId } = req.params;

    if (!mongoose.isValidObjectId(opportunityId)) {
      return res.status(400).json({ message: 'Invalid opportunity ID' });
    }

    const deleted = await SavedJob.findOneAndDelete({
      student: req.studentId,
      opportunity: opportunityId,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    res.json({ message: 'Job removed from saved jobs' });
  } catch (error) {
    console.error('Remove saved job:', error.message);
    res.status(500).json({ message: 'Failed to remove saved job' });
  }
});

module.exports = router;
