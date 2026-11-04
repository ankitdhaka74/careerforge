
const express = require('express');
const mongoose = require('mongoose');
const Opportunity = require('../models/Opportunity');

const router = express.Router();

// GET: All opportunities
router.get('/', async (req, res) => {
  try {
    const opportunities = await Opportunity.find().sort({
      createdAt: -1,
    });

    res.status(200).json(opportunities);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch opportunities',
    });
  }
});

// GET: Opportunity by ID
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid opportunity ID',
      });
    }

    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        message: 'Opportunity not found',
      });
    }

    res.status(200).json(opportunity);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch opportunity',
    });
  }
});

// POST: Create opportunity
router.post('/', async (req, res) => {
  try {
    const { companyName, jobTitle } = req.body;

    if (!companyName || !jobTitle) {
      return res.status(400).json({
        message: 'Company name and job title are required',
      });
    }

    const opportunity = await Opportunity.create(req.body);

    res.status(201).json({
      message: 'Opportunity added successfully',
      opportunity,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: error.message,
    });
  }
});

// PUT: Update opportunity
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid opportunity ID',
      });
    }

    const opportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!opportunity) {
      return res.status(404).json({
        message: 'Opportunity not found',
      });
    }

    res.status(200).json({
      message: 'Opportunity updated successfully',
      opportunity,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// DELETE: Delete opportunity
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid opportunity ID',
      });
    }

    const opportunity = await Opportunity.findByIdAndDelete(
      req.params.id
    );

    if (!opportunity) {
      return res.status(404).json({
        message: 'Opportunity not found',
      });
    }

    res.status(200).json({
      message: 'Opportunity deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete opportunity',
    });
  }
});

/* POST: Check eligibility for an opportunity */
router.post('/:id/check-eligibility', async (req, res) => {
  try {
    const mongoose = require('mongoose');

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid opportunity ID',
      });
    }

    const {
      branch,
      cgpa,
      backlogs,
      graduationYear,
    } = req.body;

    if (
      typeof branch !== 'string' ||
      !branch.trim() ||
      cgpa === undefined ||
      backlogs === undefined ||
      graduationYear === undefined ||
      !Number.isFinite(Number(cgpa)) ||
      !Number.isFinite(Number(backlogs)) ||
      !Number.isFinite(Number(graduationYear)) ||
      Number(cgpa) < 0 ||
      Number(cgpa) > 10 ||
      Number(backlogs) < 0 ||
      !Number.isInteger(Number(backlogs)) ||
      Number(graduationYear) < 1900 ||
      !Number.isInteger(Number(graduationYear))
    ) {
      return res.status(400).json({
        message: 'Enter a valid branch, CGPA (0–10), non-negative whole-number backlogs, and graduation year.',
      });
    }

    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        message: 'Opportunity not found',
      });
    }

    const reasons = [];

    const eligibleBranches = opportunity.eligibleBranches || [];

    const branchMatches =
      eligibleBranches.length === 0 ||
      eligibleBranches.some(
        (item) =>
          item.trim().toLowerCase() === branch.trim().toLowerCase()
      );

    if (!branchMatches) {
      reasons.push(
        `Your branch (${branch}) is not listed as eligible. Eligible branches: ${eligibleBranches.join(', ')}.`
      );
    }

    if (Number(cgpa) < (opportunity.minimumCGPA ?? 0)) {
      reasons.push(
        `Required CGPA: ${opportunity.minimumCGPA}; your CGPA: ${Number(cgpa)}.`
      );
    }

    if (Number(backlogs) > (opportunity.allowedBacklogs ?? 0)) {
      reasons.push(
        `Allowed backlogs: ${opportunity.allowedBacklogs}; your backlogs: ${Number(backlogs)}.`
      );
    }

    if (
      opportunity.graduationYear != null &&
      Number(graduationYear) !== Number(opportunity.graduationYear)
    ) {
      reasons.push(
        `Required graduation year: ${opportunity.graduationYear}; your year: ${Number(graduationYear)}.`
      );
    }

    return res.status(200).json({
      opportunityId: opportunity._id,
      companyName: opportunity.companyName,
      jobTitle: opportunity.jobTitle,
      eligible: reasons.length === 0,
      reasons,
    });
  } catch (error) {
    console.error('Eligibility check error:', error);

    return res.status(500).json({
      message: 'Failed to check eligibility',
    });
  }
});

module.exports = router;

