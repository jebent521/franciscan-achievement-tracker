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
};

async function resetTable(client, tableName, data) {
  await client.query(`TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE`);
  for (const obj of data) {
    const keys = Object.keys(obj).join(', ');
    const values = Object.values(obj);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    await client.query(
      `INSERT INTO ${tableName} (${keys}) VALUES (${placeholders})`,
      values
    );
  }
}

async function resetDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await resetTable(client, 'groups', testData.groups);
    await resetTable(client, 'achievements', testData.achievements);
    await client.query('COMMIT');
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
