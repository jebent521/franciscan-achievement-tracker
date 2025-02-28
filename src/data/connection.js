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

// Important: Close the pool when your application is finished (good practice)
// This releases all clients back to the pool and prevents resource leaks
// You would typically do this when your Node.js application is shutting down.
process.on('exit', () => {
  pool.end();
});

module.exports = { pool, testConnection };
