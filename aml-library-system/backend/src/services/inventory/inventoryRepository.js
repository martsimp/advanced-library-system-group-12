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

module.exports = {
    getAllMedia,
    createMedia,
    updateMedia
};
