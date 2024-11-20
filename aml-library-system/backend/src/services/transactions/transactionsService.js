const transactionsRepository = require('./transactionsRepository');

async function getUserCurrentBorrowings(userId) {
    return await transactionsRepository.getUserCurrentBorrowings(userId);
}

async function getUserReadingHistory(userId) {
    return await transactionsRepository.getUserReadingHistory(userId);
}

module.exports = {
    getUserCurrentBorrowings,
    getUserReadingHistory
}; 