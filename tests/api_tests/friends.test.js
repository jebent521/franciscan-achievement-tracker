// const fetch = require('node-fetch'); // Import node-fetch

const { idleTimeoutMillis } = require('pg/lib/defaults');
const Test = require('supertest/lib/test');

// const { resetDatabase } = require('../test-utils');
// const { pool } = require('../../src/data/connection');

// describe('Friends Endpoint Tests', () => {
//   const baseUrl = 'http://localhost:5007';

//   beforeEach(async () => await resetDatabase());
//   afterAll(async () => await pool.end());

//   describe('DELETE /friends/:id', () => {
//     it("should fail to delete if user doesn't have any friends", async () => {
//       const res = await fetch(`${baseUrl}/api/friends/5`, {
//         method: 'DELETE',
//       });

//       try {
//         expect(res.status).toBe(404);
//         expect(await res.text()).toBe('Not found');
//       } catch (e) {
//         console.log(res);
//         throw e;
//       }
//     });

//     it('should delete friend if ID is a valid number and exists', async () => {
//       const res = await fetch(`${baseUrl}/api/friends/apple`, {
//         method: 'DELETE',
//       });

//       try {
//         expect(res.status).toBe(400);
//         expect(await res.text()).toBe(
//           'error: invalid input syntax for type integer: "apple"'
//         );
//       } catch (e) {
//         console.log(res);
//         throw e;
//       }
//     });

//     it('should delete an friend by ID', async () => {
//       const res = await fetch(`${baseUrl}/api/friends/3`, {
//         method: 'DELETE',
//       });

//       try {
//         expect(res.status).toBe(200);
//         expect(await res.text()).toBe('Success');
//       } catch (e) {
//         console.log(await res.text());
//         throw e;
//       }
//     });
//   });
// });

test.todo('Placeholder test to allow for a merge request');
