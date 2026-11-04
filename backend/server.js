const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const applicationRoutes = require('./routes/applications');
const authRoutes = require('./routes/auth');
const opportunityRoutes = require('./routes/opportunities');
const savedJobsRoutes = require('./routes/savedJobs');

const app = express();

const allowedOrigins = [
  'https://careerforge-mteu.vercel.app/',
  'http://localhost:5173', // local Vite dev
];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Reuse the DB connection between serverless calls
let dbPromise;
function connectDB() {
  if (!dbPromise) {
    dbPromise = mongoose.connect(MONGO_URI).catch((error) => {
      dbPromise = null; // allow retry on next request
      throw error;
    });
  }
  return dbPromise;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'CareerForge API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/saved-jobs', savedJobsRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);

module.exports = app;

// Only listen when run locally with `node server.js`
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`CareerForge API running on port ${PORT}`);
  });
}