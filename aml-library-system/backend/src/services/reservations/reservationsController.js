const reservationsService = require('./reservationsService');

async function getUserCurrentReservations(req, res) {
    try {
        const { userId } = req.params;
        const reservations = await reservationsService.getUserCurrentReservations(userId);
        res.json(reservations);
    } catch (error) {
        console.error('Error fetching user reservations:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getUserCurrentReservations
}; 