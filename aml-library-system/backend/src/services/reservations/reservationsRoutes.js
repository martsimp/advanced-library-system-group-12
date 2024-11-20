const express = require('express');
const router = express.Router();
const reservationsController = require('./reservationsController');

router.get('/user/:userId/current', reservationsController.getUserCurrentReservations);

module.exports = router; 