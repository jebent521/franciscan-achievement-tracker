const fetch = require('node-fetch');
const { pool } = require('../../src/data/connection');
const { resetDatabase } = require('../test-utils');

describe('group_officers Endpoint Tests', () => {
  const baseUrl = 'http://localhost:5007';

  beforeEach(async () => await resetDatabase());
  afterAll(async () => await pool.end());

  describe('GET /api/groups/:group_id/officers', () => {
    it('should return a list of officers for a group', async () => {
      const res = await fetch(`${baseUrl}/api/groups/1/officers`);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual([{ group_id: 1, user_id: 3 }]);
    });

    it('should support pagination', async () => {
      const res = await fetch(`${baseUrl}/api/groups/1/officers?limit=1`);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual([{ group_id: 1, user_id: 3 }]);
    });

    it('should return an empty list if the group has no officers', async () => {
      const res = await fetch(`${baseUrl}/api/groups/999/officers`);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual([]);
    });
  });

  describe('POST /api/groups/:group_id/officers', () => {
    it('should add a new officer to the group', async () => {
      const postRes = await fetch(`${baseUrl}/api/groups/2/officers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 1 }),
      });

      expect(postRes.status).toBe(201);
      const postData = await postRes.json();
      expect(postData).toMatchObject({ group_id: 2, user_id: 1 });

      const getRes = await fetch(`${baseUrl}/api/groups/2/officers`);
      const getData = await getRes.json();
      expect(getData).toContainEqual({ group_id: 2, user_id: 1 });
    });

    it('should fail to add an officer if user_id is missing', async () => {
      const res = await fetch(`${baseUrl}/api/groups/2/officers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(400);
      const error = await res.text();
      expect(error).toBe('Missing field: user_id');
    });
  });

  describe('DELETE /api/groups/:group_id/officers/:user_id', () => {
    it('should delete an officer from the group', async () => {
      const res = await fetch(`${baseUrl}/api/groups/1/officers/3`, {
        method: 'DELETE',
      });

      expect(res.status).toBe(200);
      expect(await res.text()).toBe('Success');

      const getRes = await fetch(`${baseUrl}/api/groups/1/officers`);
      const getData = await getRes.json();
      expect(getData).not.toContainEqual({ group_id: 1, user_id: 3 });
    });

    it("should fail to delete an officer if they don't exist", async () => {
      const res = await fetch(`${baseUrl}/api/groups/999/officers/999`, {
        method: 'DELETE',
      });

      expect(res.status).toBe(404);
      expect(await res.text()).toBe('Not found');
    });
  });
});
