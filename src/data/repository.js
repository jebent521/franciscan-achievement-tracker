const { pool } = require('./connection');

class ApiResult {
    constructor(status, message, error = null) {
        this.status = status;
        this.message = message;
        this.error = error;
    }
};

class Repository {
    constructor(tableName) {
        this.tableName = tableName;
    }

    // note, this is untested, ai-generated code that is not necessary yet
    async create(params) {
        try {
            const client = await pool.connect();
            const keys = Object.keys(params).join(', ');
            const values = Object.values(params);
            const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
            const result = await client.query(
                `INSERT INTO ${this.tableName} (${keys}) VALUES (${placeholders}) RETURNING *`,
                values
            );
            client.release();
            return new ApiResult(201, result.rows[0]);
        } catch (error) {
            return this._parseError(error);
        }
    }

    async read() {
        try {
            const client = await pool.connect();
            const result = await client.query(`SELECT * FROM ${this.tableName}`);
            client.release();
            return new ApiResult(200, result.rows);
        } catch (error) {
            return this._parseError(error);
        }
    }

    async readById(id) {
        try {
            const client = await pool.connect();
            const result = await client.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
            client.release();
            if (result.rowCount === 0) {
                return new ApiResult(404, 'Not found');
            }
            return new ApiResult(200, result.rows[0]);

        } catch (error) {
            return this._parseError(error);
        }
    }

    // async update(id, params) { }

    // note, this is untested, ai-generated code that is not necessary yet
    async delete(id) {
        try {
            const client = await pool.connect();
            const result = await client.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
            client.release();
            if (result.rowCount === 0) {
                return new ApiResult(404, 'Not found');
            }
            return new ApiResult(200, 'Success');
        } catch (error) {
            return this._parseError(error);
        }
    }

    _parseError(error) {
        // type error
        if (error.code === '22P02') return new ApiResult(400, error.toString());
        // should not be null but it is
        if (error.code === '23502') return new ApiResult(400, error.toString());
        // foreign key error
        if (error.code === '23503') return new ApiResult(400, error.detail);
        // unique value conflict
        if (error.code === '23505') return new ApiResult(409, error.detail);
        // any other error
        return new ApiResult(500, 'Internal Server Error', error);
    }
}

module.exports = Repository;