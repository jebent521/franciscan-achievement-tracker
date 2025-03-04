const { pool } = require('../src/data/connection');

const testData = {
    achievements: [
        {
            title: 'Cafarrhea',
            category: "General",
            description: 'Eat at the Caf',
            prerequisite: null,
            points: 10,
        },
        {
            title: 'The Grand Slam',
            category: "Spiritual",
            description: 'Attend all four daily masses in one day',
            prerequisite: null,
            points: 100,
        },
        {
            title: 'Four Years of B.S.',
            category: "Academic",
            description: 'Be a STEM major',
            prerequisite: null,
            points: 20,
        },
    ],
};

async function resetDatabase() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('TRUNCATE TABLE achievements RESTART IDENTITY CASCADE');
        for (const achievement of testData.achievements) {
            await client.query(
                `INSERT INTO achievements (title, category, description, prerequisite, points)
                VALUES ($1, $2, $3, $4, $5)`,
                [achievement.title, achievement.category, achievement.description, achievement.prerequisite, achievement.points]
            );
        }
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