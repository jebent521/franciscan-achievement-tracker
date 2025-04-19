const { Pool, types } = require('pg');

// Configure how pg handles DATE types (OID: 1082)
types.setTypeParser(1082, (str) => {
  // Return the date as a YYYY-MM-DD string without any time information
  return str;
});

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
