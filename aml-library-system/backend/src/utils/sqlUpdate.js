const format = require("pg-format");

class SqlUpdate {
    constructor(table) {
        this.updateSql = `UPDATE ${table} SET `;
        this.updateParams = [];
        this.whereSql = "WHERE TRUE ";
        this.whereParams = [];
        this.count = 0;
    }

    addField(field, value) {
        if (!value) {
            return;
        }

        if (this.count > 0) {
            this.updateSql += ", ";
        }

        this.updateSql += ` ${field} = %L`;
        this.updateParams.push(value);
        this.count++;
    }

    addEqualFilter(field, value) {
        if (!value) {
            return;
        }

        this.whereSql += ` AND ${field} = %L`;
        this.whereParams.push(value);
    }

    generate() {
        const sql = this.updateSql + " " + this.whereSql + " RETURNING *";
        const params = this.updateParams.concat(this.whereParams);
        return format.withArray(sql, params);
    }
}

module.exports = SqlUpdate;
