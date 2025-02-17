const request = require('supertest');
const app = require('../../src/index');
const { pool } = require('../../src/data/connection');

describe('API Tests', () => {
  afterAll(async () => {
    await pool.end(); // Close the database pool to ensure all connections are closed
  });

  describe('/', () => {
    it('should return the homepage', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.text).toBe('Barons of Progress 📈 Homepage');
    });
  });

  describe('/achievements', () => {
    it('should return a list of achievements', async () => {
      const res = await request(app).get('/api/achievements');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([
        {
          id: 1,
          title: 'Cafarrhea',
          category: 'General',
          description: 'Eat at the Caf',
          prerequisite: null,
          points: 10,
        },
        {
          id: 2,
          title: 'The Grand Slam',
          category: 'Spiritual',
          description: 'Attend all four daily masses in one day',
          prerequisite: null,
          points: 100,
        },
        {
          id: 3,
          title: 'Four Years of B.S.',
          category: 'Academic',
          description: 'Be a STEM major',
          prerequisite: null,
          points: 20,
        },
      ]);
    });
  });

  describe('/achievements/:id', () => {
    it('should return a single achievement by ID', async () => {
      const res = await request(app).get('/api/achievements/1');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        id: 1,
        title: 'Cafarrhea',
        category: 'General',
        description: 'Eat at the Caf',
        prerequisite: null,
        points: 10,
      });
    });

    it('should return 404 for an achievement not found', async () => {
      const res = await request(app).get('/api/achievements/999');
      expect(res.statusCode).toEqual(404);
      expect(res.text).toBe('Achievement not found');
    });
  });
});
