const fetch = require('node-fetch');
const { pool } = require('../../src/data/connection');
const { resetDatabase } = require('../test-utils');

describe('Groups Endpoint Tests', () => {
  const baseUrl = 'http://localhost:5007';

  beforeEach(async () => await resetDatabase());
  afterAll(async () => await pool.end());

  describe('GET /api/groups', () => {
    it('should return a list of groups', async () => {
      const res = await fetch(`${baseUrl}/api/groups`);
      try {
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data).toEqual([
          {
            id: 1,
            name: 'General',
            description: 'General achievements',
          },
          {
            id: 2,
            name: 'Spiritual',
            description: 'Achievements related to spirituality',
          },
          {
            id: 3,
            name: 'Academic',
            description: 'Achievements related to academics',
          },
        ]);
      } catch (e) {
        console.error(await res.text());
        throw e;
      }
    });

    it('should support pagination', async () => {
      const res = await fetch(`${baseUrl}/api/groups?limit=1&offset=2`);
      try {
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data).toEqual([
          {
            id: 3,
            name: 'Academic',
            description: 'Achievements related to academics',
          },
        ]);
      } catch (e) {
        console.error(await res.text());
        throw e;
      }
    });
  });

  describe('GET /api/groups/:id', () => {
    it('should return a single group by ID', async () => {
      const res = await fetch(`${baseUrl}/api/groups/1`);
      try {
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data).toEqual({
          id: 1,
          name: 'General',
          description: 'General achievements',
        });
      } catch (e) {
        console.error(await res.text());
        throw e;
      }
    });

    it('should support pagination', async () => {
      const res = await fetch(`${baseUrl}/api/groups/1?limit=1`);
      try {
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data).toEqual({
          id: 1,
          name: 'General',
          description: 'General achievements',
        });
      } catch (e) {
        console.error(await res.text());
        throw e;
      }
    });

    it('should return a 404 for a group that does not exist', async () => {
      const res = await fetch(`${baseUrl}/api/groups/999`);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/groups', () => {
    it('should create a new group', async () => {
      const res = await fetch(`${baseUrl}/api/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Group',
          description: 'A test group',
          officer_user_id: 1,
        }),
      });
      try {
        expect(res.status).toBe(201);
        const data = await res.json();
        expect(data).toEqual({
          id: 4,
          name: 'Test Group',
          description: 'A test group',
        });
      } catch (e) {
        console.error(await res.text());
        throw e;
      }
    });

    it('should return a 400 for a group with missing fields', async () => {
      const res = await fetch(`${baseUrl}/api/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      expect(res.status).toBe(400);
    });

    it('should return a 409 for a group with a duplicate name', async () => {
      const res = await fetch(`${baseUrl}/api/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'General',
          description: 'A test group',
          officer_user_id: 1,
        }),
      });
      expect(res.status).toBe(409);
    });
  });

  describe('DELETE /api/groups/:id', () => {
    it('should delete a group by ID', async () => {
      await fetch(`${baseUrl}/api/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Group',
          description: 'A test group',
          officer_user_id: 1,
        }),
      });
      const res = await fetch(`${baseUrl}/api/groups/4`, { method: 'DELETE' });
      try {
        expect(res.status).toBe(200);
        const data = await res.text();
        expect(data).toBe('Success');
      } catch (e) {
        console.error(await res.text());
        throw e;
      }
    });

    it('should return a 404 for a group that does not exist', async () => {
      const res = await fetch(`${baseUrl}/api/groups/999`, {
        method: 'DELETE',
      });
      expect(res.status).toBe(404);
    });
  });
});
