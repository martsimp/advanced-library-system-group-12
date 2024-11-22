const express = require('express');
const controller = require('./TransferController');
const router = express.Router();

// Route to fetch media and branches
router.get('/media', controller.getMediaAndBranches);

// Route to fetch media for a specific branch
router.get('/branch/:branchId', controller.getBranchMedia);

// Route to transfer media between branches
router.post('/transfer', controller.transferMedia);

// Route to add media to branch
router.post('/addMedia', controller.addMediaToBranch);

// Route to fetch media info
router.get('/mediaInfo/:mediaName', controller.getMediaInfo);

module.exports = router;
