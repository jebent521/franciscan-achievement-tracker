const fetch = require('node-fetch');
const { pool } = require('../../src/data/connection');
const { resetDatabase } = require('../test-utils');

describe('group_members Endpoint Tests', () => {
  const baseUrl = 'http://localhost:5007';

  beforeEach(async () => await resetDatabase());
  afterAll(async () => await pool.end());

  describe('GET /api/groups/:group_id/members', () => {
    it('should return a list of members for a group', async () => {
      const res = await fetch(`${baseUrl}/api/groups/1/members`);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual([
        { group_id: 1, user_id: 1 },
        { group_id: 1, user_id: 2 },
        { group_id: 1, user_id: 3 },
      ]);
    });

    it('should return an empty list if the group has no members', async () => {
      const res = await fetch(`${baseUrl}/api/groups/999/members`);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual([]);
    });
  });

  describe('POST /api/groups/:group_id/members', () => {
    it('should add a new member to the group', async () => {
      const postRes = await fetch(`${baseUrl}/api/groups/2/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 3 }),
      });

      expect(postRes.status).toBe(201);
      const postData = await postRes.json();
      expect(postData).toMatchObject({ group_id: 2, user_id: 3 });

      const getRes = await fetch(`${baseUrl}/api/groups/2/members`);
      const getData = await getRes.json();
      expect(getData).toContainEqual({ group_id: 2, user_id: 3 });
    });

    it('should fail to add a member if user_id is missing', async () => {
      const res = await fetch(`${baseUrl}/api/groups/2/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(400);
      const error = await res.text();
      expect(error).toBe('Missing field: user_id');
    });
  });

  describe('DELETE /api/groups/:group_id/members/:user_id', () => {
    it('should delete a member from the group', async () => {
      const res = await fetch(`${baseUrl}/api/groups/1/members/1`, {
        method: 'DELETE',
      });

      expect(res.status).toBe(200);
      expect(await res.text()).toBe('Success');

      const getRes = await fetch(`${baseUrl}/api/groups/1/members`);
      const getData = await getRes.json();
      expect(getData).not.toContainEqual({ group_id: 1, user_id: 1 });
    });

    it("should fail to delete a member if they don't exist", async () => {
      const res = await fetch(`${baseUrl}/api/groups/999/members/999`, {
        method: 'DELETE',
      });

      expect(res.status).toBe(404);
      expect(await res.text()).toBe('Not found');
    });
  });
});
