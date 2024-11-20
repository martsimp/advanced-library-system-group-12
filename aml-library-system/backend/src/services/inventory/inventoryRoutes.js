const express = require('express');
const router = express.Router();
const inventoryController = require('./inventoryController');

router.get('/search', inventoryController.searchMedia);
router.get('/filters', inventoryController.getFilterOptions);

router.get('/', inventoryController.getAllMedia);
router.post('/create', inventoryController.createMedia);
router.get('/:id', inventoryController.getMediaById);
router.post('/:id/update', inventoryController.updateMedia);
router.post('/:id/delete', inventoryController.deleteMedia);

module.exports = router;
