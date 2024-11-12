const express = require('express');
const router = express.Router();
const userController = require('./userController');

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:firebaseUid', userController.getUserByFirebaseUid);

module.exports = router;
