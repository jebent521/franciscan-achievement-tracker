const fetch = require('node-fetch'); // Import node-fetch

const { resetDatabase } = require('../test-utils');
const { pool } = require('../../src/data/connection');

describe('Friends Endpoint Tests', () => {
  const baseUrl = 'http://localhost:5007';

  beforeEach(async () => await resetDatabase());
  afterAll(async () => await pool.end());

  describe('GET /friends', () => {
    it('should return a list of friends', async () => {
      const res = await fetch(`${baseUrl}/api/friends`);
      try {
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data).toEqual([
          {
            user_id: 1,
            friend_id: 2,
            accepted: true,
          },
          {
            user_id: 3,
            friend_id: 2,
            accepted: true,
          },
          {
            user_id: 3,
            friend_id: 4,
            accepted: false,
          },
        ]);
      } catch (e) {
        console.log(res);
        throw e;
      }
    });
  });

  describe('GET /friends/:user_id', () => {
    it('should return a single friend by ID', async () => {
      const res = await fetch(`${baseUrl}/api/friends/1`);
      try {
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data).toEqual({
          user_id: 1,
          friend_id: 2,
          accepted: true,
        });
      } catch (e) {
        console.log(res);
        throw e;
      }
    });
  });

  describe('POST /friends', () => {
    it('should add a friend to the database', async () => {
      const res = await fetch(`${baseUrl}/api/friends`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1,
          friend_id: 2,
          accepted: true,
        }),
      });
      try {
        expect(res.status).toBe(201);
        const data = await res.json();
        expect(data).toEqual({
          user_id: 1,
          friend_id: 4,
          accepted: false,
        });
      } catch (e) {
        console.log(res);
        throw e;
      }
    });
  });

  describe('DELETE /friends/:user_id', () => {
    it("should fail to delete if user doesn't have any friends", async () => {
      const res = await fetch(`${baseUrl}/api/friends/5`, {
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

    it('should delete friend if ID is a valid number and exists', async () => {
      const res = await fetch(`${baseUrl}/api/friends/apple`, {
        method: 'DELETE',
      });

      try {
        expect(res.status).toBe(400);
        expect(await res.text()).toBe(
          'error: invalid input syntax for type integer: "apple"'
        );
      } catch (e) {
        console.log(res);
        throw e;
      }
    });

    it('should delete an friend by ID', async () => {
      const res = await fetch(`${baseUrl}/api/friends/3`, {
        method: 'DELETE',
      });

      try {
        expect(res.status).toBe(200);
        expect(await res.text()).toBe('Success');
      } catch (e) {
        console.log(await res.text());
        throw e;
      }
    });
  });
});
