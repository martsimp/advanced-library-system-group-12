const format = require("pg-format");

class SqlFilter {
    constructor(sql, params) {
        this.sql = sql;
        this.params = params;
    }

    addLikeFilter(field, value) {
        if (!value) {
            return;
        }

        this.sql += ` AND ${field} LIKE '%%' || %L || '%%'`;
        this.params.push(value);
    }

    addEqualFilter(field, value) {
        if (!value) {
            return;
        }

        this.sql += ` AND ${field} = %L`;
        this.params.push(value);
    }

    generate() {
        return format.withArray(this.sql, this.params);
    }
}

module.exports = SqlFilter;
