const applicationRoutes = require('./routes/applications');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const opportunityRoutes = require('./routes/opportunities');
const savedJobsRoutes = require('./routes/savedJobs');
const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'CareerForge API is running!',
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/saved-jobs', savedJobsRoutes);
// Placement opportunity routes
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);
// Connect MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/careerforge';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');

    app.listen(PORT, () => {
      console.log(
        `CareerForge API running at http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
  });
