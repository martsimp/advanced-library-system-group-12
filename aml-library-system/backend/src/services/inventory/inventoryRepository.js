const db = require('../../config/database');

async function getAllMedia() {
    const result = await db.query('SELECT * FROM media');
    return result.rows;
}

module.exports = {
    getAllMedia
};
