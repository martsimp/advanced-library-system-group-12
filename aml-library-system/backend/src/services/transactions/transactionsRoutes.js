const express = require('express');
const router = express.Router();
const transactionsController = require('./transactionsController');

router.get('/user/:userId/current', transactionsController.getUserCurrentBorrowings);
router.get('/user/:userId/history', transactionsController.getUserReadingHistory);
router.post('/:transactionId/renew', transactionsController.renewBook);
router.post('/borrow', transactionsController.borrowMedia);

module.exports = router; 