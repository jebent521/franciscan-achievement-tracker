const { pool } = require('../src/data/connection');

const testData = {
  groups: [
    {
      name: 'General',
      description: 'General achievements',
    },
    {
      name: 'Spiritual',
      description: 'Achievements related to spirituality',
    },
    {
      name: 'Academic',
      description: 'Achievements related to academics',
    },
  ],
  achievements: [
    {
      title: 'Cafarrhea',
      group_id: 1,
      description: 'Eat at the Caf',
      prerequisite: null,
      points: 10,
    },
    {
      title: 'The Grand Slam',
      group_id: 2,
      description: 'Attend all four daily masses in one day',
      prerequisite: null,
      points: 100,
    },
    {
      title: 'Four Years of B.S.',
      group_id: 3,
      description: 'Be a STEM major',
      prerequisite: null,
      points: 20,
    },
  ],
  users: [
    {
      name: 'Angsty Alice',
      email: 'alice@angst.com',
      password: 'password123',
      points: 0,
    },
    {
      name: 'Boring Bob',
      email: 'bob@bored.com',
      password: 'password123',
      points: 0,
    },
    {
      name: 'Cranky Carol',
      email: 'carol@crank.com',
      password: 'password123',
      points: 0,
    },
  ],
};

// Simple function to insert data into tables
async function insertTableData(client, tableName, dataArray) {
  if (!dataArray || dataArray.length === 0) return;

  for (const item of dataArray) {
    const keys = Object.keys(item).join(', ');
    const values = Object.values(item);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    await client.query(
      `INSERT INTO ${tableName} (${keys}) VALUES (${placeholders})`,
      values
    );
  }
}

// Simple semaphore to prevent concurrent resets
let isResetting = false;
let resetPromise = null;

// Streamlined database reset function
async function resetDatabase() {
  // If a reset is already in progress, wait for it to complete
  if (isResetting) {
    return resetPromise;
  }

  isResetting = true;
  resetPromise = _resetDatabase().finally(() => {
    isResetting = false;
  });

  return resetPromise;
}

// The actual database reset implementation
async function _resetDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // One single truncate statement for all tables
    await client.query(`
      TRUNCATE TABLE 
        achievements,
        groups,
        users
      RESTART IDENTITY CASCADE
    `);

    // Insert data in order (parent tables first)
    await insertTableData(client, 'users', testData.users);
    await insertTableData(client, 'groups', testData.groups);
    await insertTableData(client, 'achievements', testData.achievements);

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  resetDatabase,
};
