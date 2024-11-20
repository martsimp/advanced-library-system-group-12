const db = require('../../config/database');

async function getUserCurrentBorrowings(userId) {
    const query = `
        SELECT 
            t.id as transaction_id,
            t.borrow_date,
            t.due_date,
            t.status,
            m.title,
            m.author,
            m.id as media_id
        FROM transactions t
        JOIN media m ON t.media_id = m.id
        WHERE t.user_id = $1 
        AND t.status = 'borrowed'
        AND t.return_date IS NULL
        ORDER BY t.due_date ASC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
}

module.exports = {
    getUserCurrentBorrowings
}; 