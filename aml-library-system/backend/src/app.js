const express = require('express');
const userRoutes = require('./services/user/userRoutes');
const inventoryRoutes = require('./services/inventory/inventoryRoutes');
const transactionsRoutes = require('./services/transactions/transactionsRoutes');
const reservationsRoutes = require('./services/reservations/reservationsRoutes');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use('/api/users', userRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/reservations', reservationsRoutes);

app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app; 