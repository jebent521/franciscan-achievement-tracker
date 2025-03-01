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
        console.log(res);
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

  describe('POST /achievements', () => {
    it('should add an achievement to the database', async () => {
      const res = await fetch(`${baseURL}/api/achievements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "title": "Test case 4",
          "category": "Challenge me if you dare",
          "description": "Don't even think about it",
          "prerequisite": 1,
          "points": 12
        })
      });      
      try {
        expect(res.status).toBe(201);
        const data = await res.json();
        expect(data).toEqual({
          "id": 4,
          "title": "Test case 4",
          "category": "Challenge me if you dare",
          "description": "Don't even think about it",
          "prerequisite": 1,
          "points": 12
        }
        );
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

  // For a DELETE request : fail, achievement by id is not in database
  describe('DELETE /achievements/:id', () => {
    it('should fail to delete if achievement doesn\'t exist', async () => {
      const res = await fetch(`${baseURL}/api/achievements/5`, {
        method: 'DELETE'
      });

      try {
        expect(res.status).toBe(404); 
        expect(await res.text()).toBe('Not found');
      } catch (e) {
        console.log(res);
        throw e;
      }
    });
  });

  // For a DELETE request : fail not an integer
  describe('DELETE /achievements/:id', () => {
    it('should delete achievement if ID is a valid number and exists', async () => {
      const res = await fetch(`${baseURL}/api/achievements/apple`, {
        method: 'DELETE'
      });

      try {
        expect(res.status).toBe(400); 
        expect(await res.text()).toBe('error: invalid input syntax for type integer: "apple"');
      } catch (e) {
        console.log(res);
        throw e;
      }
    });
  });

  // For a DELETE request : successful delete
  describe('DELETE /achievements/:id', () => {
    it('should delete an achievement by ID', async () => {
      const res = await fetch(`${baseURL}/api/achievements/3`, {
        method: 'DELETE'
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
