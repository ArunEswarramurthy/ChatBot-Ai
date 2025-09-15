const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Database connection
let db = null;
const initDB = async () => {
  if (!db && process.env.DATABASE_URL) {
    try {
      const mysql = require('mysql2/promise');
      db = await mysql.createConnection(process.env.DATABASE_URL);
      console.log('Database connected');
    } catch (error) {
      console.error('Database connection failed:', error.message);
    }
  }
};

// Basic CORS setup
app.use(cors({
  origin: '*',
  credentials: true
}));

// JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check - simple endpoint
app.get('/api/health', async (req, res) => {
  await initDB();
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Backend is running successfully',
    database: db ? 'Connected' : 'Not configured'
  });
});

// Database test endpoint
app.get('/api/db-test', async (req, res) => {
  try {
    await initDB();
    if (!db) {
      return res.status(500).json({ error: 'Database not configured' });
    }
    const [rows] = await db.execute('SELECT 1 as test');
    res.json({ message: 'Database connection successful', result: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Basic test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Vercel serverless function handler
module.exports = app;