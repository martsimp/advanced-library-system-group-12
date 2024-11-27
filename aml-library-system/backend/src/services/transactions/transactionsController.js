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

async function renewBook(req, res) {
    try {
        const { transactionId } = req.params;
        const { new_due_date } = req.body;
        
        const updatedTransaction = await transactionsService.renewBook(transactionId, new_due_date);
        res.json(updatedTransaction);
    } catch (error) {
        console.error('Error renewing book:', error);
        res.status(500).json({ error: error.message });
    }
}

async function borrowMedia(req, res) {
    try {
        const { userId, mediaId, branchId } = req.body;
        if (!userId || !mediaId || !branchId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const transaction = await transactionsService.borrowMedia(userId, mediaId, branchId);
        res.json(transaction);
    } catch (error) {
        console.error('Error borrowing media:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getUserCurrentBorrowings,
    getUserReadingHistory,
    renewBook,
    borrowMedia
}; 