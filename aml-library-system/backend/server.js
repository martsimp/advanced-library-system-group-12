const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const db = require('./src/config/database');
const userRoutes = require('./src/services/user/userRoutes');
const inventoryRoutes = require('./src/services/inventory/inventoryRoutes');
const transactionsRoutes = require('./src/services/transactions/transactionsRoutes');
const reservationsRoutes = require('./src/services/reservations/reservationsRoutes');
const mediaTransferRoutes = require('./src/services/mediaTransfer/TransferRoutes');
const branchRoutes = require('./src/services/branch/branchRoutes');

const app = express();

// Configure CORS to allow requests from the frontend!!
app.use(cors({
  origin: 'http://localhost:3000', // MAKE SURE YOURE RUNNING FRONT END FROM 3000
  credentials: true
}));

// PARSER FOR MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/mediaTransfer', mediaTransferRoutes);
app.use('/api/branches', branchRoutes);

// Test for the DB
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
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 