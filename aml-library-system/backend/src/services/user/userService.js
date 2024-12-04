const userRepository = require('./userRepository');

async function getUserByFirebaseUid(firebaseUid) {
    return await userRepository.getUserByFirebaseUid(firebaseUid);
}

async function createUser(userData) {
    return await userRepository.createUser(userData);
}

module.exports = {
    getUserByFirebaseUid,
    createUser
};
