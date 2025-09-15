const express = require('express');
const cors = require('cors');
const passport = require('../config/passport');
require('dotenv').config();

const sequelize = require('../config/db');
const errorHandler = require('../middleware/errorHandler');

// Import routes
const authRoutes = require('../routes/auth');
const chatRoutes = require('../routes/chat');
const stripeRoutes = require('../routes/stripe');
const adminRoutes = require('../routes/admin');

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3004',
  'http://localhost:3000',
  'https://your-actual-frontend-domain.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Raw body for Stripe webhooks
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// JSON parsing for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize database connection
let dbConnected = false;
const initDB = async () => {
  if (!dbConnected) {
    try {
      await sequelize.authenticate();
      console.log('Database connected');
      dbConnected = true;
    } catch (err) {
      console.error('Database connection failed:', err);
    }
  }
};

// Vercel serverless function handler
module.exports = async (req, res) => {
  await initDB();
  return app(req, res);
};