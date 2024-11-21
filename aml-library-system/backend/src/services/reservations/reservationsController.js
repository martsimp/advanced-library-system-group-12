const reservationsService = require('./reservationsService');

async function getUserCurrentReservations(req, res) {
    try {
        const { userId } = req.params;
        console.log('Fetching reservations for user ID:', userId); // Debug log
        const reservations = await reservationsService.getUserCurrentReservations(userId);
        console.log('Found reservations:', reservations); // Debug log
        res.json(reservations);
    } catch (error) {
        console.error('Error in reservations controller:', error);
        res.status(500).json({ error: error.message });
    }
}

async function cancelReservation(req, res) {
    try {
        const { reservationId } = req.params;
        await reservationsService.cancelReservation(reservationId);
        res.status(200).json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling reservation:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getUserCurrentReservations,
    cancelReservation
}; 