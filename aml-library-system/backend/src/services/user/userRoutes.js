const express = require('express');
const router = express.Router();
const userController = require('./userController');

router.get('/:firebaseUid', userController.getUserByFirebaseUid);
router.post('/register', userController.registerUser);
router.post('/:firebaseUid/tutorial', userController.updateTutorialStatus);

module.exports = router;
