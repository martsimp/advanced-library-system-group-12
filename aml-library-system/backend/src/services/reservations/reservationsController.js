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

module.exports = {
    getUserCurrentReservations
}; 