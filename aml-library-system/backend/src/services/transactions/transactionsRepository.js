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

async function getUserReadingHistory(userId) {
    const query = `
        SELECT 
            t.id as transaction_id,
            t.borrow_date,
            t.return_date,
            m.title,
            m.author,
            m.id as media_id
        FROM transactions t
        JOIN media m ON t.media_id = m.id
        WHERE t.user_id = $1 
        AND t.return_date IS NOT NULL
        AND t.return_date >= NOW() - INTERVAL '1 year'
        ORDER BY t.return_date DESC
    `;
    
    const currentYearResult = await db.query(query, [userId]);
    
    // Get last year's count for comparison
    const lastYearQuery = `
        SELECT COUNT(*)
        FROM transactions
        WHERE user_id = $1
        AND return_date IS NOT NULL
        AND return_date >= NOW() - INTERVAL '2 year'
        AND return_date < NOW() - INTERVAL '1 year'
    `;
    
    const lastYearResult = await db.query(lastYearQuery, [userId]);
    
    return {
        currentYearBooks: currentYearResult.rows,
        lastYearCount: parseInt(lastYearResult.rows[0].count)
    };
}

module.exports = {
    getUserCurrentBorrowings,
    getUserReadingHistory
}; 