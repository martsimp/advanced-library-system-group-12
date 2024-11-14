const express = require('express');
const router = express.Router();
const branchController = require('./branchController');

router.get('/', branchController.getAllBranches);
router.post('/create', branchController.createBranch);
router.get('/:id', branchController.getBranchById);
router.post('/:id/update', branchController.updateBranch);
router.post('/:id/delete', branchController.deleteBranch);

module.exports = router;
