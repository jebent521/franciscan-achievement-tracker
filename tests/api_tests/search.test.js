const fetch = require('node-fetch');

describe('Search Tests', () => {
  const baseUrl = 'http://localhost:5007/api/search';

  const expectedResult = {
    users: [
      {
        id: 1,
        name: 'Angsty Alice',
        email: 'alice@angst.com',
        points: 0,
      },
    ],
    groups: [
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
    ],
    achievements: [
      {
        id: 2,
        title: 'The Grand Slam',
        group_id: 2,
        description: 'Attend all four daily masses in one day',
        prerequisite: null,
        points: 100,
      },
    ],
  };

  describe('GET /api/search', () => {
    it('should default to return users, groups, and achievements', async () => {
      const res = await fetch(`${baseUrl}/al`);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(expectedResult);
    });
  });

  it('should filter by users', async () => {
    const res = await fetch(`${baseUrl}/al?filter=users`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ users: expectedResult.users });
  });

  it('should filter by groups', async () => {
    const res = await fetch(`${baseUrl}/al?filter=groups`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ groups: expectedResult.groups });
  });

  it('should filter by achievements', async () => {
    const res = await fetch(`${baseUrl}/al?filter=achievements`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      achievements: expectedResult.achievements,
    });
  });

  it('should filter by multiple parameters', async () => {
    const res = await fetch(`${baseUrl}/al?filter=users,achievements`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      users: expectedResult.users,
      achievements: expectedResult.achievements,
    });
  });

  it('should reject invalid filters', async () => {
    const res = await fetch(`${baseUrl}/al?filter=invalid`);
    expect(res.status).toBe(400);
    expect(await res.text()).toBe("Invalid filter parameter 'invalid'");
  });
});
