const { Pool } = require('pg');

// Connection details (best practice to store these in environment variables)
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'achievements_db',
  password: process.env.DB_PASSWORD || 'franny_devs',
  port: process.env.DB_PORT || 5432,
});

// Test the connection
module.exports.testConnection = async function () {
  const client = await pool.connect(); // Get a client from the pool
  console.log('Successfully connected to PostgreSQL!');
  client.release(); // Return the client to the pool
}

/**
 * Get achievements from the database
 * 
 * @param {number?} id - The ID of the achievement to retreive. Leave empty to get all achievements.
*/
module.exports.getAchievements = async function (id) {
  const client = await pool.connect();
  let result;
  if (id) {
    result = await client.query('SELECT * FROM achievements WHERE id = $1', [id]);
  } else {
    result = await client.query('SELECT * FROM achievements');
  }
  console.log('Achievements:', result.rows);
  client.release();
  // TODO: use an ORM to map the results to a class
  return result.rows;
}

// Important: Close the pool when your application is finished (good practice)
// This releases all clients back to the pool and prevents resource leaks
// You would typically do this when your Node.js application is shutting down.
process.on('exit', () => {
  pool.end();
  console.log('Pool closed.');
});