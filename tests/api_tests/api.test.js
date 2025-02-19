const fetch = require('node-fetch'); // Import node-fetch

describe('API Tests', () => {
  const baseURL = 'http://localhost:5007/';

  describe('GET /', () => {
    it('should return the homepage', async () => {
      const res = await fetch(baseURL);
      expect(res.status).toBe(200);
      expect(await res.text()).toBe('Barons of Progress 📈 Homepage');
    });
  });

  describe('/achievments', () => {
    it('should return a list of achievements', async () => {
      const res = await fetch(`${baseURL}api/achievements`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data).toEqual([
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
      const res = await fetch(`${baseURL}api/achievements/1`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({
        id: 1,
        title: 'Cafarrhea',
        category: 'General',
        description: 'Eat at the Caf',
        prerequisite: null,
        points: 10,
      });
    });
  });
});
