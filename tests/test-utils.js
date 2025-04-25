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
    {
      name: 'Depressed David',
      email: 'david@depressed.com',
      oauth_id: 'depressing-oauth-id',
      points: 0,
    },
    {
      name: 'Edgy Edward',
      email: 'edgy@edward.com',
      oauth_id: 'edgy-oauth-id',
      points: 0,
    },
  ],
  user_achievements: [
    {
      user_id: 1,
      achievement_id: 1,
      date_achieved: '2025-03-06',
    },
    {
      user_id: 1,
      achievement_id: 2,
      date_achieved: '2025-03-06',
    },
    {
      user_id: 1,
      achievement_id: 3,
      date_achieved: '2025-03-06',
    },
    {
      user_id: 2,
      achievement_id: 1,
      date_achieved: '2020-01-01',
    },
    {
      user_id: 2,
      achievement_id: 2,
      date_achieved: '2020-01-02',
    },
    {
      user_id: 3,
      achievement_id: 1,
      date_achieved: '2020-01-01',
    },
  ],
  group_members: [
    {
      group_id: 1,
      user_id: 1,
    },
    {
      group_id: 1,
      user_id: 2,
    },
    {
      group_id: 1,
      user_id: 3,
    },
    {
      group_id: 2,
      user_id: 1,
    },
    {
      group_id: 2,
      user_id: 2,
    },
    {
      group_id: 3,
      user_id: 1,
    },
  ],
  group_officers: [
    {
      group_id: 1,
      user_id: 3,
    },
    {
      group_id: 2,
      user_id: 2,
    },
    {
      group_id: 3,
      user_id: 1,
    },
  ],
  friends: [
    {
      id: 1, 
      friend_id: 2,
    },
    {
      id: 3, 
      friend_id: 2,
    },
    {
      id: 3, 
      friend_id: 4,
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

// The actual database reset implementation
async function resetDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // One single truncate statement for all tables
    await client.query(`
      TRUNCATE TABLE 
        user_achievements,
        achievements,
        groups,
        users,
        friends
      RESTART IDENTITY CASCADE
    `);

    // Insert data in order (parent tables first)
    await insertTableData(client, 'users', testData.users);
    await insertTableData(client, 'groups', testData.groups);
    await insertTableData(client, 'achievements', testData.achievements);
    await insertTableData(client, 'group_members', testData.group_members);
    await insertTableData(client, 'group_officers', testData.group_officers);
    await insertTableData(
      client,
      'user_achievements',
      testData.user_achievements
    );
    await insertTableData(client, 'friends', testData.friends);

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
