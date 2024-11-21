const express = require('express');
const router = express.Router();
const userController = require('./userController');

router.get('/:firebaseUid', userController.getUserByFirebaseUid);
router.post('/register', userController.registerUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
