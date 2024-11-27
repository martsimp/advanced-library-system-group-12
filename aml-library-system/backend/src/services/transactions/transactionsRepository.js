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

async function renewBook(transactionId, newDueDate) {
    const query = `
        UPDATE transactions 
        SET due_date = $1
        WHERE id = $2 
        AND status = 'borrowed'
        AND return_date IS NULL
        RETURNING *
    `;
    
    const result = await db.query(query, [newDueDate, transactionId]);
    return result.rows[0];
}

async function borrowMedia(userId, mediaId, branchId) {
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        // Check media availability in branch
        const availabilityQuery = `
            SELECT available_copies 
            FROM branch_media_inventory 
            WHERE branch_id = $1 AND media_id = $2
        `;
        const availabilityResult = await client.query(availabilityQuery, [branchId, mediaId]);
        
        if (!availabilityResult.rows[0] || availabilityResult.rows[0].available_copies < 1) {
            throw new Error('Media not available at this branch');
        }

        // Create transaction
        const borrowQuery = `
            INSERT INTO transactions (
                user_id, media_id, branch_id, 
                borrow_date, due_date, status
            ) VALUES (
                $1, $2, $3, 
                CURRENT_TIMESTAMP, 
                CURRENT_TIMESTAMP + INTERVAL '14 days',
                'borrowed'
            ) RETURNING *
        `;
        const borrowResult = await client.query(borrowQuery, [userId, mediaId, branchId]);

        // Update inventory
        const updateInventoryQuery = `
            UPDATE branch_media_inventory 
            SET available_copies = available_copies - 1
            WHERE branch_id = $1 AND media_id = $2
        `;
        await client.query(updateInventoryQuery, [branchId, mediaId]);

        await client.query('COMMIT');
        return borrowResult.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    getUserCurrentBorrowings,
    getUserReadingHistory,
    renewBook,
    borrowMedia
}; 