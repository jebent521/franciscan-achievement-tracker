const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'achievements_db',
  password: process.env.DB_PASSWORD || 'franny_devs',
  port: process.env.DB_PORT || 5432,
});

/**
 * Test the connection
 */
async function testConnection() {
  const client = await pool.connect(); // Get a client from the pool
  client.release(); // Return the client to the pool
}

module.exports = {
  testConnection,
  pool,
};
