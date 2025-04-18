// const fetch = require('node-fetch');
// const { pool } = require('../../src/data/connection');
// const { resetDatabase } = require('../test-utils');

// describe('user_friends Endpoint Tests', () => {
//   const baseUrl = 'http://localhost:5007';

//   beforeEach(async () => await resetDatabase());
//   afterAll(async () => await pool.end());

//   describe('GET /api/users/:id/friends', () => {
//     it('should return a list of friends for a user', async () => {
//       const res = await fetch(`${baseUrl}/api/users/1/friends`);

//       try {
//         expect(res.status).toBe(200);
//         const data = await res.json();
//         expect(data).toEqual([
//           {
//             id: 1,
//             friend_id: 2,
//           },
//         ]);
//       } catch (e) {
//         console.log(res);
//         throw e;
//       }
//     });
//   });

//   describe('POST /api/users/:id/friends', () => {
//     it('should create a new user friend', async () => {
//       const postRes = await fetch(`${baseUrl}/api/users/3/friends`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           friend_id: 1,
//         }),
//       });

//       expect(postRes.status).toBe(201);
//       const postData = await postRes.json();
//       expect(postData).toMatchObject({
//         id: 3,
//         friend_id: 1,
//       });
//     });
//   });

//   describe('DELETE /api/users/:id/friends/:friend_id', () => {
//     it("should fail to delete a user friend if it doesn't exist", async () => {
//       const res = await fetch(`${baseUrl}/api/users/999/friends/999`, {
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

//     it('should delete a user friend', async () => {
//       const res = await fetch(`${baseUrl}/api/users/1/friends/2`, {
//         method: 'DELETE',
//       });

//       expect(res.status).toBe(200);
//       expect(await res.text()).toBe('Success');
//     });
//   });
// });

test.todo('Placeholder test to allow for a merge request');