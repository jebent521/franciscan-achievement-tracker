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

/**
 * Remove achievement from the database
 *
 * @param {number?} id - The ID of the achievement to delete. Leave empty will not delete anything.
 */
async function deleteAchievement(id) {
  const client = await pool.connect();
  const result = await client.query('DELETE FROM achievements WHERE id = $1', [
    id,
  ]);
  if (result.rows === 0) {
    return 'Achievement not found.';
  }
  client.release();
}

// Important: Close the pool when your application is finished (good practice)
// This releases all clients back to the pool and prevents resource leaks
// You would typically do this when your Node.js application is shutting down.
process.on('exit', () => {
  pool.end();
});

module.exports = {
  testConnection,
  pool
};
