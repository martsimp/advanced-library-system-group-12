const db = require('../../config/database');

async function getAllUsers() {
    const result = await db.query('SELECT * FROM users');
    return result.rows;
}

module.exports = {
    getAllUsers
};
