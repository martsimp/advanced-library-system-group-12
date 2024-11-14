const db = require('../../config/database');
const SqlFilter = require('../../utils/sqlFilter');
const SqlUpdate = require('../../utils/sqlUpdate');
const format = require("pg-format");

async function getAllBranches(filter) {
    filter = filter || {};

    let f = new SqlFilter('SELECT * FROM branches WHERE TRUE', []);
    f.addEqualFilter("id", filter.id);

    const result = await db.query(f.generate());
    return result.rows;
}

async function createBranch(data) {
    const sql = format(
        "INSERT INTO branches (name, city, street_address, postal_code, monday_friday_open, monday_friday_close, saturday_open, saturday_close, sunday_open, sunday_close)VALUES (%L, %L, %L, %L, %L, %L, %L, %l, %l, %L) RETURNING id",
        data.name, data.city, data.street_address, data.postal_code, data.monday_friday_open, data.monday_friday_close, data.saturday_open, data.saturday_close, data.sunday_open, data.sunday_close
    );

    const result = await db.query(sql);
    return result.rows[0];
}

async function updateBranch(id, data) {
    if (id === undefined) {
        throw new Error("missing ID");
    }

    console.debug(id);

    const update = new SqlUpdate("branches");
    update.addEqualFilter("id", id);
    update.addField("name", data.name);
    update.addField("city", data.city);
    update.addField("street_address", data.street_address);
    update.addField("postal_code", data.postal_code);
    update.addField("format", data.format);
    update.addField("monday_friday_open", data.monday_friday_open);
    update.addField("saturday_open", data.saturday_open);
    update.addField("saturday_close", data.saturday_close);
    update.addField("sunday_open", data.sunday_open);
    update.addField("sunday_close", data.sunday_close);

    console.debug(update.generate());
    const result = await db.query(update.generate());
    return result.rows[0];
}

async function deleteBranch(id) {
    const sql = format("DELETE FROM branches WHERE id = %L", id);
    const result = await db.query(sql);
}

module.exports = {
    getAllBranches,
    createBranch,
    updateBranch,
    deleteBranch
};
