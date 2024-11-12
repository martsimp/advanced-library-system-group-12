const express = require('express');
const router = express.Router();
const inventoryController = require('./inventoryController');

router.get('/', inventoryController.getAllMedia);
router.get('/:id', inventoryController.getMediaById);

module.exports = router;
