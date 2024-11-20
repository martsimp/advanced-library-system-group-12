const express = require('express');
const userRoutes = require('./services/user/userRoutes');
const inventoryRoutes = require('./services/inventory/inventoryRoutes');
const transactionsRoutes = require('./services/transactions/transactionsRoutes');
const cors = require('cors');

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/transactions', transactionsRoutes);

// Middleware error handling
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Add a test route to verify the server is running
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running' });
});

module.exports = app; 