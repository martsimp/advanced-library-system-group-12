const transactionsRepository = require('./transactionsRepository');

async function getUserCurrentBorrowings(userId) {
    return await transactionsRepository.getUserCurrentBorrowings(userId);
}

module.exports = {
    getUserCurrentBorrowings
}; 