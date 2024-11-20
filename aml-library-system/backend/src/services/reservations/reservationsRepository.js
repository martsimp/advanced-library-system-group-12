const db = require('../../config/database');

async function getUserCurrentReservations(userId) {
    const query = `
        SELECT 
            r.id as reservation_id,
            r.reserve_date,
            r.status,
            r.queue_position,
            m.title,
            m.author,
            m.id as media_id,
            b.name as branch_name
        FROM reservations r
        JOIN media m ON r.media_id = m.id
        JOIN branches b ON r.branch_id = b.id
        WHERE r.user_id = $1 
        AND r.status IN ('active', 'fulfilled')
        ORDER BY r.reserve_date ASC
    `;
    
    try {
        const result = await db.query(query, [userId]);
        console.log('Reservations query result:', result.rows); // Debug log
        return result.rows;
    } catch (error) {
        console.error('Error in getUserCurrentReservations:', error);
        throw error;
    }
}

module.exports = {
    getUserCurrentReservations
}; 