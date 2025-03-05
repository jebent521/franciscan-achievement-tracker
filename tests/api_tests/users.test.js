const fetch = require('node-fetch');
const { pool } = require('../../src/data/connection');
const { resetDatabase } = require('../test-utils');

describe('Users Endpoint Tests', () => {
  const baseUrl = 'http://localhost:5007';

  beforeEach(async () => await resetDatabase());
  afterAll(async () => await pool.end());

  describe('GET /api/users', () => {
    it('should return a list of users', async () => {
      const res = await fetch(`${baseUrl}/api/users`);
      try {
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data).toEqual([
          {
            id: 1,
            name: 'Angsty Alice',
            email: 'alice@angst.com',
            password: 'password123',
            points: 0,
          },
          {
            id: 2,
            name: 'Boring Bob',
            email: 'bob@bored.com',
            password: 'password123',
            points: 0,
          },
          {
            id: 3,
            name: 'Cranky Carol',
            email: 'carol@crank.com',
            password: 'password123',
            points: 0,
          },
        ]);
      } catch (e) {
        console.error(await res.text());
        throw e;
      }
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a single user by ID', async () => {
      const res = await fetch(`${baseUrl}/api/users/1`);
      try {
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data).toEqual({
          id: 1,
          name: 'Angsty Alice',
          email: 'alice@angst.com',
          password: 'password123',
          points: 0,
        });
      } catch (e) {
        console.error(await res.text());
        throw e;
      }
    });

    it('should return a 404 for a user that does not exist', async () => {
      const res = await fetch(`${baseUrl}/api/users/999`);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const res = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Lazy Susan',
          email: 'susan@lazy.com',
          password: 'password123',
          points: 10,
        }),
      });
      try {
        expect(res.status).toBe(201);
        const data = await res.json();
        expect(data).toEqual({
          id: 4,
          name: 'Lazy Susan',
          email: 'susan@lazy.com',
          password: 'password123',
          points: 10,
        });
      } catch (e) {
        console.error(await res.text());
        throw e;
      }
    });

    it('should return a 400 for a user with missing fields', async () => {
      const res = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      expect(res.status).toBe(400);
    });

    it('should return a 409 for a user with a duplicate name', async () => {
      const res = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Angsty Alice',
          email: 'alice@angst.com',
          password: 'password123',
          points: 10,
        }),
      });
      expect(res.status).toBe(409);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user by ID', async () => {
      await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Angsty Alice',
          email: 'alice@angst.com',
          password: 'password123',
          points: 0,
        }),
      });
      const res = await fetch(`${baseUrl}/api/users/4`, { method: 'DELETE' });
      try {
        expect(res.status).toBe(200);
        const data = await res.text();
        expect(data).toBe('Success');
      } catch (e) {
        console.error(await res.text());
        throw e;
      }
    });

    it('should return a 404 for a user that does not exist', async () => {
      const res = await fetch(`${baseUrl}/api/users/999`, {
        method: 'DELETE',
      });
      expect(res.status).toBe(404);
    });
  });
});
