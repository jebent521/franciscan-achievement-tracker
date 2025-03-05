const fetch = require('node-fetch');

describe('Root Endpoint Tests', () => {
  const baseUrl = 'http://localhost:5007';

  describe('GET /', () => {
    it('should return the homepage', async () => {
      const res = await fetch(baseUrl);
      try {
        expect(res.status).toBe(200);
        expect(await res.text()).toBe('Barons of Progress 📈 Homepage');
      } catch (e) {
        console.log(res);
        throw e;
      }
    });
  });
});
