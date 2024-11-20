const express = require('express');
const router = express.Router();
const transactionsController = require('./transactionsController');

router.get('/user/:userId/current', transactionsController.getUserCurrentBorrowings);
router.get('/user/:userId/history', transactionsController.getUserReadingHistory);

module.exports = router; 