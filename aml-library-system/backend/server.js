const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const db = require('./config/db');

const app = express();

// Test database route
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ 
      message: 'Database connected successfully',
      timestamp: result.rows[0].now
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: 'Database connection error',
      error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 