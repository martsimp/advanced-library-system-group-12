const db = require('../../config/database');
const SqlFilter = require('../../utils/sqlFilter');
const SqlUpdate = require('../../utils/sqlUpdate');
const format = require("pg-format");

async function getAllMedia(filter) {
    filter = filter || {};

    let f = new SqlFilter('SELECT * FROM media WHERE TRUE', []);
    f.addEqualFilter("id", filter.id);
    f.addLikeFilter("title", filter.title);
    f.addLikeFilter("author", filter.author);
    f.addEqualFilter("genre", filter.genre);
    f.addEqualFilter("publication_year", filter.publication_year);
    f.addEqualFilter("format", filter.format);
    f.addEqualFilter("status", filter.status);
    f.addLikeFilter("description", filter.description);
    f.addEqualFilter("total_copies", filter.total_copies);

    const result = await db.query(f.generate());
    return result.rows;
}

async function createMedia(data) {
    const sql = format(
        "INSERT INTO media (title, author, genre, publication_year, format, status, description, total_copies) VALUES (%L, %L, %L, %L, %L, %L, %L, %L) RETURNING id",
        data.title, data.author, data.genre, data.publication_year, data.format, data.status, data.description, data.total_copies
    );

    const result = await db.query(sql);
    return result.rows[0];
}

async function updateMedia(id, data) {
    if (id === undefined) {
        throw new Error("missing ID");
    }

    console.debug(id);

    const update = new SqlUpdate("media");
    update.addEqualFilter("id", id);
    update.addField("title", data.title);
    update.addField("author", data.author);
    update.addField("genre", data.genre);
    update.addField("publication_year", data.publication_year);
    update.addField("format", data.format);
    update.addField("status", data.status);
    update.addField("description", data.description);
    update.addField("total_copies", data.total_copies);

    console.debug(update.generate());
    const result = await db.query(update.generate());
    return result.rows[0];
}

async function deleteMedia(id) {
    const sql = format("DELETE FROM media WHERE id = %L", id);
    const result = await db.query(sql);
}

async function getReservations(filter) {
    let f = new SqlFilter('SELECT * FROM reservations WHERE TRUE', []);
    f.addEqualFilter("id", filter.id);
    f.addEqualFilter("user_id", filter.user_id);
    f.addEqualFilter("media_id", filter.media_id);
    f.addEqualFilter("branch_id", filter.branch_id);
    const result = await db.query(f.generate());
    return result.rows;
}

async function createReservation(data) {
    const existing = await getReservations({ media_id: data.media_id, branch_id: data.branch_id });
    const queue = Math.max(...existing.map(o => o.queue_position), 0) + 1;

    const sql = format("INSERT INTO reservations (user_id, media_id, branch_id, reserve_date, status, queue_position, notification_sent) VALUES (%L, %L, %L, CURRENT_TIMESTAMP(), 'active', %L, false) RETURNING id",
        data.user, data.media_id, data.branch_id, queue);
    const result = await db.query(sql);
    return result.rows[0];
}

async function deleteReservation(id) {
    const sql = format("DELETE FROM reservations WHERE id = %L", id);
    await db.query(sql);
}

async function fulfillReservation(id) {
    const res = await getReservations({ "id": id });
    if (res.length !== 1) {
        throw new Error("Unknown reservation ID");
    }

    const sql = format("UPDATE reservations SET status = 'fulfilled' WHERE id = %L", id);
    await db.query(sql);

    // Now update the positions of all pending reservations
    const posSql = format("UPDATE reservations SET queue_position = queue_position - 1 WHERE STATUS = 'active' AND media_id = %L AND branch_id = %L", res.media_id, res.branch_id);
    await db.query(sql);
}

async function searchMedia({ searchQuery, genre, format, status, sortBy }) {
    let query = `
        SELECT 
            m.id,
            m.title,
            m.author,
            m.genre,
            m.publication_year,
            m.format,
            m.status,
            m.description,
            m.total_copies
        FROM media m
        WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;

    // Search query for title, author, or description
    if (searchQuery) {
        query += ` AND (
            LOWER(m.title) LIKE LOWER($${paramCount}) OR 
            LOWER(m.author) LIKE LOWER($${paramCount}) OR 
            LOWER(m.description) LIKE LOWER($${paramCount})
        )`;
        params.push(`%${searchQuery}%`);
        paramCount++;
    }

    // Genre filter
    if (genre && genre !== 'all') {
        query += ` AND LOWER(m.genre) = LOWER($${paramCount})`;
        params.push(genre);
        paramCount++;
    }

    // Format filter
    if (format && format !== 'all') {
        query += ` AND LOWER(m.format) = LOWER($${paramCount})`;
        params.push(format);
        paramCount++;
    }

    // Status filter
    if (status && status !== 'all') {
        query += ` AND LOWER(m.status) = LOWER($${paramCount})`;
        params.push(status);
        paramCount++;
    }

    // Sorting
    switch (sortBy) {
        case 'title':
            query += ` ORDER BY m.title ASC`;
            break;
        case 'author':
            query += ` ORDER BY m.author ASC`;
            break;
        case 'publication_year':
            query += ` ORDER BY m.publication_year DESC`;
            break;
        default:
            query += ` ORDER BY m.title ASC`;
    }

    try {
        const result = await db.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('Error in searchMedia:', error);
        throw error;
    }
}

// Get distinct values for filters
async function getFilterOptions() {
    try {
        const genres = await db.query('SELECT DISTINCT genre FROM media ORDER BY genre');
        const formats = await db.query('SELECT DISTINCT format FROM media ORDER BY format');
        const statuses = await db.query('SELECT DISTINCT status FROM media ORDER BY status');

        return {
            genres: genres.rows.map(row => row.genre),
            formats: formats.rows.map(row => row.format),
            statuses: statuses.rows.map(row => row.status)
        };
    } catch (error) {
        console.error('Error getting filter options:', error);
        throw error;
    }
}

module.exports = {
    getAllMedia,
    createMedia,
    updateMedia,
    deleteMedia,
    getReservations,
    createReservation,
    deleteReservation,
    fulfillReservation,
    searchMedia,
    getFilterOptions
};
