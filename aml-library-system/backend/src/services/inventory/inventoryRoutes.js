const express = require('express');
const router = express.Router();
const inventoryController = require('./inventoryController');

router.get('/', inventoryController.getAllMedia);
router.post('/create', inventoryController.createMedia);
router.get('/:id', inventoryController.getMediaById);
router.post('/:id/update', inventoryController.updateMedia);

module.exports = router;
