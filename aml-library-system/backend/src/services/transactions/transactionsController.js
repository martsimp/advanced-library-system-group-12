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

async function getUserReadingHistory(req, res) {
    try {
        const { userId } = req.params;
        const history = await transactionsService.getUserReadingHistory(userId);
        res.json(history);
    } catch (error) {
        console.error('Error fetching reading history:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getUserCurrentBorrowings,
    getUserReadingHistory
}; 