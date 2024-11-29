const reservationsRepository = require('./reservationsRepository');
const userService = require("../user/userService");

async function getUserCurrentReservations(userId, mediaId) {
    try {
        console.log('Getting reservations for user:', userId); // Debug log
        return await reservationsRepository.getUserCurrentReservations(userId, mediaId);
    } catch (error) {
        console.error('Error in reservations service:', error);
        throw error;
    }
}

async function createReservation(data) {
    const user = await userService.getUserByFirebaseUid(data.user);
    // Transform the user into its database ID which is needed by the reservations table.
    data.user = user.id;
    return await reservationsRepository.createReservation(data);
}

async function cancelReservation(reservationId) {
    return await reservationsRepository.cancelReservation(reservationId);
}

module.exports = {
    getUserCurrentReservations,
    createReservation,
    cancelReservation
}; 