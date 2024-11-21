const reservationsRepository = require('./reservationsRepository');

async function getUserCurrentReservations(userId) {
    try {
        console.log('Getting reservations for user:', userId); // Debug log
        return await reservationsRepository.getUserCurrentReservations(userId);
    } catch (error) {
        console.error('Error in reservations service:', error);
        throw error;
    }
}

async function cancelReservation(reservationId) {
    return await reservationsRepository.cancelReservation(reservationId);
}

module.exports = {
    getUserCurrentReservations,
    cancelReservation
}; 