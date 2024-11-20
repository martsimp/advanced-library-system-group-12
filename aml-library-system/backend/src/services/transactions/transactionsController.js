const transactionsService = require('./transactionsService');

async function getUserCurrentBorrowings(req, res) {
    try {
        const { userId } = req.params;
        const borrowings = await transactionsService.getUserCurrentBorrowings(userId);
        res.json(borrowings);
    } catch (error) {
        console.error('Error fetching user borrowings:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getUserCurrentBorrowings
}; 