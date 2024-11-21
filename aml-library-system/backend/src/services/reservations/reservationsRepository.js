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

async function cancelReservation(reservationId) {
    const query = `
        DELETE FROM reservations 
        WHERE id = $1 
        AND status = 'active'
        RETURNING media_id, branch_id
    `;
    
    const result = await db.query(query, [reservationId]);
    
    // If there was a reservation deleted, update queue positions for remaining reservations
    if (result.rows.length > 0) {
        const { media_id, branch_id } = result.rows[0];
        
        // Update queue positions for remaining active reservations
        const updateQuery = `
            UPDATE reservations 
            SET queue_position = queue_position - 1
            WHERE media_id = $1 
            AND branch_id = $2
            AND status = 'active'
            AND queue_position > 0
        `;
        
        await db.query(updateQuery, [media_id, branch_id]);
    }
    
    return result.rows[0];
}

module.exports = {
    getUserCurrentReservations,
    cancelReservation
}; 