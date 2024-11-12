const userRepository = require('./userRepository');

async function getAllUsers() {
    return await userRepository.getAllUsers();
}

async function createUser(userData) {
    // Validate required fields
    if (!userData.firebase_uid || !userData.email || !userData.name) {
        throw new Error('Missing required fields');
    }

    // This sets the defaults (user roles etc)
    const userWithDefaults = {
        ...userData,
        role: userData.role || 'member',
        notifications_enabled: userData.notifications_enabled ?? true,
        outstanding_fines: userData.outstanding_fines || 0
    };

    return await userRepository.createUser(userWithDefaults);
}

async function getUserByFirebaseUid(firebaseUid) {
    return await userRepository.getUserByFirebaseUid(firebaseUid);
}

module.exports = {
    getAllUsers,
    createUser,
    getUserByFirebaseUid
};
