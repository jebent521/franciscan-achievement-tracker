const { pool } = require('./connection');
const ApiResult = require('../utils/api-result');

class Repository {
  constructor(tableName) {
    this.tableName = tableName;
  }

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
      const result = await client.query(
        `SELECT * FROM ${this.tableName} WHERE id = $1`,
        [id]
      );
      client.release();
      if (result.rowCount === 0) {
        return new ApiResult(404, 'Not found');
      }
      return new ApiResult(200, result.rows[0]);
    } catch (error) {
      return this._parseError(error);
    }
  }

  async readByCustom(column, value) {
    try {
      const client = await pool.connect();
      const result = await client.query(
        `SELECT * FROM ${this.tableName} WHERE ${column} = $1`,
        [value]
      );
      client.release();

      if (result.rowCount === 0) {
        return new ApiResult(404, 'Not found');
      }
      return new ApiResult(200, result.rows);
    } catch (error) {
      return this._parseError(error);
    }
  }

  async deleteByCriteria(criteria) {
    try {
      const client = await pool.connect();
      const result = await client.query(
        `DELETE FROM ${this.tableName}
        WHERE ${Object.keys(criteria)
          .map((k, i) => `${k} = $${i + 1}`)
          .join(' OR ')}`,
        Object.values(criteria)
      );
      client.release();
      if (result.rowCount === 0) {
        return new ApiResult(404, 'Not found');
      }
      return new ApiResult(200, 'Success');
    } catch (error) {
      return this._parseError(error);
    }
  }

  async update(id, params) {
    try {
      const client = await pool.connect();
      const keys = Object.keys(params);
      const values = Object.values(params);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

      // Add the id to the values array
      values.push(id);

      // Construct the query
      let query = `INSERT INTO ${this.tableName} (id, ${keys.join(
        ', '
      )}) VALUES ($${values.length}, ${placeholders})
        ON CONFLICT (id)
        DO UPDATE SET `;

      // Add the update assignments
      query += keys.map((key, i) => `${key} = EXCLUDED.${key}`).join(', ');

      // Add a RETURNING clause to determine the operation
      query += ` RETURNING (xmax = 0) AS is_insert;`;

      // Execute the query
      const result = await client.query(query, values);
      client.release();

      // Check the value of `is_insert` to determine the operation
      const isInsert = result.rows[0].is_insert;

      if (isInsert) {
        return new ApiResult(201, null); // Return 201 for INSERT
      } else {
        return new ApiResult(204, null); // Return 204 for UPDATE
      }
    } catch (error) {
      return this._parseError(error);
    }
  }

  async delete(id) {
    try {
      const client = await pool.connect();
      const result = await client.query(
        `DELETE FROM ${this.tableName} WHERE id = $1`,
        [id]
      );
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
    // column does not exist in table
    if (error.code === '42703') return new ApiResult(400, error.toString());
    // any other error
    return new ApiResult(500, 'Internal Server Error', error);
  }
}

module.exports = Repository;
