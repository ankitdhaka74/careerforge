
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const applicationRoutes = require('./routes/applications');
const authRoutes = require('./routes/auth');
const opportunityRoutes = require('./routes/opportunities');
const savedJobsRoutes = require('./routes/savedJobs');

const app = express();

app.use(cors({
  origin: 'https://career-forge-sepia.vercel.app'
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'CareerForge API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/saved-jobs', savedJobsRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');
    app.listen(PORT, () => {
      console.log(`CareerForge API running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('MongoDB connection failed:', error.message);
  });
