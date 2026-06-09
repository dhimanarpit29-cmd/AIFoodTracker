const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const mealRoutes = require('./routes/meals');
const userRoutes = require('./routes/users');

// Initialize SQLite database
require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI-Powered Meal Plate Analyzer API is running' });
});

// AI Analysis health check endpoint
app.get('/api/health/analysis', (req, res) => {
  const healthStatus = {
    status: 'healthy',
    services: {
      googleVision: false,
      nutritionix: false,
      fallback: true
    },
    timestamp: new Date().toISOString()
  };

  // Check Google Cloud Vision configuration
  try {
    const fs = require('fs');
    const visionPath = require('path').join(__dirname, 'service-account-key.json');
    if (fs.existsSync(visionPath)) {
      healthStatus.services.googleVision = true;
    }
  } catch (error) {
    console.warn('Google Cloud Vision health check error:', error.message);
  }

  // Check Nutritionix API configuration
  const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID || "8c766f3b";
  const NUTRITIONIX_APP_KEY = process.env.NUTRITIONIX_APP_KEY || "b86ac4ebaa853e7e5de1e60717df4507";

  if (NUTRITIONIX_APP_ID && NUTRITIONIX_APP_KEY &&
      NUTRITIONIX_APP_ID !== "8c766f3b" && NUTRITIONIX_APP_KEY !== "b86ac4ebaa853e7e5de1e60717df4507") {
    healthStatus.services.nutritionix = true;
  }

  // Determine overall status
  if (healthStatus.services.googleVision && healthStatus.services.nutritionix) {
    healthStatus.status = 'excellent';
    healthStatus.message = 'All AI services are properly configured';
  } else if (healthStatus.services.googleVision || healthStatus.services.nutritionix) {
    healthStatus.status = 'good';
    healthStatus.message = 'Some AI services configured, fallback available';
  } else {
    healthStatus.status = 'basic';
    healthStatus.message = 'Using fallback analysis only';
  }

  res.json(healthStatus);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.errors
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid Data Type',
      message: 'Invalid ID or data format provided'
    });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'File Too Large',
      message: 'File size exceeds the maximum allowed limit'
    });
  }

  // Generic error response
  res.status(err.status || 500).json({
    error: 'Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    availableRoutes: {
      health: '/api/health',
      analysisHealth: '/api/health/analysis',
      auth: '/api/auth',
      meals: '/api/meals',
      users: '/api/users'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 AI-Powered Meal Plate Analyzer is ready!`);
  console.log(`🔗 Access the app at: http://localhost:${PORT}`);
  console.log(`💚 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Analysis Health Check: http://localhost:${PORT}/api/health/analysis`);
  console.log(`📚 Available routes: /api/auth, /api/meals, /api/users`);
});

module.exports = app;
