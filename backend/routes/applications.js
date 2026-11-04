
const express = require('express');
const mongoose = require('mongoose');

const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All application routes require a valid JWT.
router.use(authMiddleware);

// GET: Fetch applications belonging to the logged-in student.
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.studentId,
    })
      .populate(
        'opportunity',
        'companyName jobTitle location jobType description'
      )
      .sort({ appliedAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error('Fetch applications error:', error.message);

    res.status(500).json({
      message: 'Failed to fetch applications.',
    });
  }
});

// POST: Apply to an opportunity.
router.post('/', async (req, res) => {
  try {
    const { opportunityId } = req.body;

    if (
      typeof opportunityId !== 'string' ||
      !mongoose.isValidObjectId(opportunityId)
    ) {
      return res.status(400).json({
        message: 'Please provide a valid opportunity ID.',
      });
    }

    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      return res.status(404).json({
        message: 'This opportunity does not exist.',
      });
    }

    const existingApplication = await Application.findOne({
      student: req.studentId,
      opportunity: opportunityId,
    });

    if (existingApplication) {
      return res.status(409).json({
        message: 'You have already applied to this opportunity.',
        application: existingApplication,
      });
    }

    const application = await Application.create({
      student: req.studentId,
      opportunity: opportunityId,
      status: 'Applied',
    });

    const populatedApplication = await Application.findById(
      application._id
    ).populate(
      'opportunity',
      'companyName jobTitle location jobType description'
    );

    return res.status(201).json({
      message: 'Application saved successfully.',
      application: populatedApplication,
    });
  } catch (error) {
    // Handles a duplicate caused by two simultaneous requests.
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'You have already applied to this opportunity.',
      });
    }

    console.error('Create application error:', error.message);

    return res.status(500).json({
      message: 'Failed to save application.',
    });
  }
});

module.exports = router;
