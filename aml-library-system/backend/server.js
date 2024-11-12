const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const db = require('./src/config/database');
const userRoutes = require('./src/services/user/userRoutes');

const app = express();

// MIDDLEWARE CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
}));

// PARSER FOR MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);

// Test for da db
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