const userRepository = require('./userRepository');

async function getUserByFirebaseUid(firebaseUid) {
    return await userRepository.getUserByFirebaseUid(firebaseUid);
}

async function createUser(userData) {
    return await userRepository.createUser(userData);
}

async function updateTutorialStatus(firebaseUid) {
    return await userRepository.updateTutorialStatus(firebaseUid);
}

module.exports = {
    getUserByFirebaseUid,
    createUser,
    updateTutorialStatus
};
