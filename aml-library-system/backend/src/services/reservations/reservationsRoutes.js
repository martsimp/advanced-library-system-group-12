const express = require('express');
const router = express.Router();
const reservationsController = require('./reservationsController');

router.get('/user/:userId/current', reservationsController.getUserCurrentReservations);
router.delete('/:reservationId/cancel', reservationsController.cancelReservation);

module.exports = router; 