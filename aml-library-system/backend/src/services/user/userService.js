const userRepository = require('./userRepository');

async function getAllUsers() {
    return await userRepository.getAllUsers();
}

module.exports = {
    getAllUsers
};
