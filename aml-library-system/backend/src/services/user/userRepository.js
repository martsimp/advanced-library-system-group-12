const db = require('../../config/database');

async function getUserByFirebaseUid(firebaseUid) {
    const query = 'SELECT * FROM users WHERE firebase_uid = $1';
    const result = await db.query(query, [firebaseUid]);
    return result.rows[0];
}

async function createUser(userData) {
    const query = `
        INSERT INTO users (
            firebase_uid,
            email,
            name,
            phone,
            street_address,
            city,
            postal_code,
            notifications_enabled,
            role,
            outstanding_fines
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
    `;
    
    const values = [
        userData.firebase_uid,
        userData.email,
        userData.name,
        userData.phone,
        userData.street_address,
        userData.city,
        userData.postal_code,
        userData.notifications_enabled,
        userData.role,
        userData.outstanding_fines
    ];

    const result = await db.query(query, values);
    return result.rows[0];
}

module.exports = {
    getUserByFirebaseUid,
    createUser
};
