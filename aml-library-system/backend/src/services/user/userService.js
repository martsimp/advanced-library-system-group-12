const userRepository = require('./userRepository');

async function getUserByFirebaseUid(firebaseUid) {
    return await userRepository.getUserByFirebaseUid(firebaseUid);
}

async function createUser(userData) {
    return await userRepository.createUser(userData);
}

async function updateUser(id, userData) {
    return await userRepository.updateUser(id, userData);
}

async function deleteUser(id) {
    return await userRepository.deleteUser(id);
}

module.exports = {
    getUserByFirebaseUid,
    createUser,
    updateUser,
    deleteUser
};
