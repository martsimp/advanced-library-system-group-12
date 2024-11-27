const express = require('express');
const router = express.Router();
const reservationsController = require('./reservationsController');

router.post('/create', reservationsController.createReservation);
router.get('/user/:userId/current', reservationsController.getUserCurrentReservations);
router.delete('/:reservationId/cancel', reservationsController.cancelReservation);

module.exports = router; 