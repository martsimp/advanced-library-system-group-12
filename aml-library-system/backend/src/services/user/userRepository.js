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

async function updateUser(id, userData) {
    const query = `
        UPDATE users
        SET name = $1, email = $2, phone = $3, street_address = $4,
            city = $5, postal_code = $6, notifications_enabled = $7
        WHERE id = $8
        RETURNING *
    `;
    
    const values = [
        userData.name,
        userData.email,
        userData.phone,
        userData.street_address,
        userData.city,
        userData.postal_code,
        userData.notifications_enabled,
        id
    ];

    const result = await db.query(query, values);
    return result.rows[0];
}

async function deleteUser(id) {
    const query = 'DELETE FROM users WHERE id = $1';
    await db.query(query, [id]);
}

module.exports = {
    getUserByFirebaseUid,
    createUser,
    updateUser,
    deleteUser
};
