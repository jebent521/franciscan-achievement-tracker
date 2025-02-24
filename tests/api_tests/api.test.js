const fetch = require('node-fetch'); // Import node-fetch

describe('API Tests', () => {
  const baseURL = 'http://localhost:5007';

  describe('GET /', () => {
    it('should return the homepage', async () => {
      const res = await fetch(baseURL);
      try {
        expect(res.status).toBe(200);
        expect(await res.text()).toBe('Barons of Progress 📈 Homepage');
      } catch (e) {
        console.error(
          'GET / failed:',
          e.message,
          'Status:',
          res.status,
          'Response:',
          await res.text()
        );
        throw e;
      }
    });
  });

  describe('GET /achievements', () => {
    it('should return a list of achievements', async () => {
      const res = await fetch(`${baseURL}/api/achievements`);
      try {
        expect(res.status).toBe(200);
        const data = await res.json();
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
      } catch (e) {
        console.log(res);
        throw e;
      }
    });
  });

  describe('GET /achievements/:id', () => {
    it('should return a single achievement by ID', async () => {
      const res = await fetch(`${baseURL}/api/achievements/1`);
      try {
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
      } catch (e) {
        console.log(res);
        throw e;
      }
    });
  });
});
