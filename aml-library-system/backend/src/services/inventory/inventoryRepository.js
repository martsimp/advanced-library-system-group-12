const db = require('../../config/database');
const SqlFilter = require('../../utils/sqlFilter');

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

module.exports = {
    getAllMedia
};
