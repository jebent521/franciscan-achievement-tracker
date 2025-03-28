const fetch = require('node-fetch');
const { resetDatabase } = require('../test-utils');

describe('GET /api/search', () => {
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

  beforeAll(async () => {
    await resetDatabase();
  });

  it('should default to return users, groups, and achievements', async () => {
    const res = await fetch(`${baseUrl}/al`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(expectedResult);
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

  it('should be safe from sql injection', async () => {
    // would query `al'; DELETE FROM users;--`
    const res = await fetch(`${baseUrl}/al%27%3B%20DELETE%20FROM%20users%3B--`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      users: [],
      groups: [],
      achievements: [],
    });

    // get all users
    const userSearch = await fetch(`${baseUrl}/_?filter=users`);
    expect(userSearch.status).toBe(200);
    expect(await userSearch.json()).toEqual({
      users: [
        {
          id: 1,
          name: 'Angsty Alice',
          email: 'alice@angst.com',
          points: 0,
        },
        {
          id: 2,
          name: 'Boring Bob',
          email: 'bob@bored.com',
          points: 0,
        },
        {
          id: 3,
          name: 'Cranky Carol',
          email: 'carol@crank.com',
          points: 0,
        },
      ],
    });
  });
});
