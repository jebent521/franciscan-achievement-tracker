const request = require('supertest');
const app = require('../../src/index');

describe('/', () => {
    it('should return the homepage', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBe('Barons of Progress 📈 Homepage');
    });
});

describe('/achievments', () => {
    it('should return a list of achievements', async () => {
        const res = await request(app).get('/api/achievements');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([
            {
                id: 1,
                title: 'The Source and The Summit',
                category: 'Franny Basics',
                description: 'Attend Mass on Campus',
                prerequisite: null,
                points: 10
            },
            {
                id: 2,
                title: 'Cafarrhea',
                category: 'Franny Basics',
                description: 'Eat at the Caf',
                prerequisite: null,
                points: 20
            },
            {
                id: 3,
                title: 'Lets Shake Things Up',
                category: 'Franny Basics',
                description: 'Eat at the Pub',
                prerequisite: null,
                points: 20
            }
        ]);
    });
});

describe('/achievments/:id', () => {
    it('should return a single achievement by ID', async () => {
        const res = await request(app).get('/api/achievements/1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            id: 1,
            title: 'The Source and The Summit',
            category: 'Franny Basics',
            description: 'Attend Mass on Campus',
            prerequisite: null,
            points: 10
        });
    });

    it('should return 404 for an achievement not found', async () => {
        const res = await request(app).get('/api/achievements/999');
        expect(res.statusCode).toEqual(404);
        expect(res.text).toBe('Achievement not found');
    });
});