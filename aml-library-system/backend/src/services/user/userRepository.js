const db = require('../../config/database');

async function getAllUsers() {
    const result = await db.query('SELECT * FROM users');
    return result.rows;
}

async function createUser(userData) {
    const {
        firebase_uid,
        role,
        name,
        email,
        phone,
        street_address,
        city,
        postal_code,
        notifications_enabled,
        outstanding_fines
    } = userData;

    const query = `
        INSERT INTO users (
            firebase_uid,
            role,
            name,
            email,
            phone,
            street_address,
            city,
            postal_code,
            notifications_enabled,
            outstanding_fines
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
    `;

    const values = [
        firebase_uid,
        role,
        name,
        email,
        phone,
        street_address,
        city,
        postal_code,
        notifications_enabled,
        outstanding_fines
    ];

    const result = await db.query(query, values);
    return result.rows[0];
}

async function getUserByFirebaseUid(firebaseUid) {
    const result = await db.query(
        'SELECT * FROM users WHERE firebase_uid = $1',
        [firebaseUid]
    );
    return result.rows[0];
}

module.exports = {
    getAllUsers,
    createUser,
    getUserByFirebaseUid
};
