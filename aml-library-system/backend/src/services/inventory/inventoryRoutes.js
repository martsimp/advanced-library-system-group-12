const express = require('express');
const router = express.Router();
const inventoryController = require('./inventoryController');

router.get('/reservations', inventoryController.getReservations);
router.post('/reservations/create', inventoryController.createReservation);
router.post('/reservation/:id/fulfill', inventoryController.fulfillReservation)
router.post('/reservation/:id/delete', inventoryController.deleteReservation)
router.get('/', inventoryController.getAllMedia);
router.post('/create', inventoryController.createMedia);
router.get('/:id', inventoryController.getMediaById);
router.post('/:id/update', inventoryController.updateMedia);
router.post('/:id/delete', inventoryController.deleteMedia);

module.exports = router;
