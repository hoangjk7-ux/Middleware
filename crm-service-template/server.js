const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
if (!process.env.VERCEL) {
  dotenv.config();
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
const connectDB = require('./app/config/database');
connectDB().catch(err => {
  console.error('Failed to connect to database:', err);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/interactions', require('./routes/interactions'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/sync', require('./routes/sync'));

// Database status endpoint
app.get('/api/db-status', (req, res) => {
  const dbType = process.env.DATABASE_TYPE || 'mongodb';
  res.json({
    status: 'OK',
    database: dbType,
    message: `Connected to ${dbType} database`
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'CRM Service is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// For Vercel serverless functions
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // For local development
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ CRM Service running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Database: ${process.env.DATABASE_TYPE || 'mongodb'}`);
  });
}