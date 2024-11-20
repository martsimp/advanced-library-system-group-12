const transactionsRepository = require('./transactionsRepository');

async function getUserCurrentBorrowings(userId) {
    return await transactionsRepository.getUserCurrentBorrowings(userId);
}

async function getUserReadingHistory(userId) {
    return await transactionsRepository.getUserReadingHistory(userId);
}

async function renewBook(transactionId, newDueDate) {
    return await transactionsRepository.renewBook(transactionId, newDueDate);
}

module.exports = {
    getUserCurrentBorrowings,
    getUserReadingHistory,
    renewBook
};