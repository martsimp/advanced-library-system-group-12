const reservationsRepository = require('./reservationsRepository');

async function getUserCurrentReservations(userId) {
    return await reservationsRepository.getUserCurrentReservations(userId);
}

module.exports = {
    getUserCurrentReservations
}; 