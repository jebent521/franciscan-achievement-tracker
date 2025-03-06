const fetch = require('node-fetch');
const { pool } = require('../../src/data/connection');
const { resetDatabase } = require('../test-utils');

describe('user_achievement Endpoint Tests', () => {
  const baseUrl = 'http://localhost:5007';

  beforeEach(async () => await resetDatabase());
  afterAll(async () => await pool.end());

  describe('GET /api/users/:user_id/achievements', () => {
    it('should return a list of achievements for a user', async () => {
      const res = await fetch(`${baseUrl}/api/users/1/achievements`);

      try {
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data).toEqual([
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
        ]);
      } catch (e) {
        console.log(res);
        throw e;
      }
    });
  });

  describe('POST /api/users/:user_id/achievements', () => {
    it('should create a new user achievement', async () => {
      const res = await fetch(`${baseUrl}/api/users/3/achievements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          achievement_id: 3,
        }),
      });

      try {
        expect(res.status).toBe(201);
        const data = await res.json();
        expect(data).toMatchObject({
          user_id: 3,
          achievement_id: 3,
        });
      } catch (e) {
        console.log(res);
        throw e;
      }
    });
  });

  describe('DELETE /api/users/:user_id/achievements/:achievement_id', () => {
    it("should fail to delete a user achievement if it doesn't exist", async () => {
      const res = await fetch(`${baseUrl}/api/users/999/achievements/999`, {
        method: 'DELETE',
      });

      try {
        expect(res.status).toBe(404);
        expect(await res.text()).toBe('Not found');
      } catch (e) {
        console.log(res);
        throw e;
      }
    });

    it('should delete a user achievement', async () => {
      const res = await fetch(`${baseUrl}/api/users/1/achievements/1`, {
        method: 'DELETE',
      });

      try {
        expect(res.status).toBe(200);
        expect(await res.text()).toBe('Success');
      } catch (e) {
        console.log(res);
        throw e;
      }
    });
  });
});
