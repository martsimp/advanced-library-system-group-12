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
            m.id as media_id
        FROM reservations r
        JOIN media m ON r.media_id = m.id
        WHERE r.user_id = $1 
        AND r.status IN ('pending', 'ready')
        ORDER BY r.reserve_date ASC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
}

module.exports = {
    getUserCurrentReservations
}; 