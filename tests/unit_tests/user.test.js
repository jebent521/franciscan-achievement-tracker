const User = require('../../src/models/user');

// Good data test
const user1 = new User('bobert24', '1234', 'bob@gmail.com'); // the original
const user2 = new User('bobert24', '1234', 'bob@gmail.com'); // the copy

test('Test user class: see if users are copies of each other.', () => {
  expect(user1.equals(user2)).toBe(true);
});

// Bad data Test
const user3 = new User('Heartseeker', '1234', 'bob@gmail.com'); // one difference
const user4 = new User('Heartseeker', '2121', 'bob@gmail.com'); // two differences
const user5 = new User('Heartseeker', '2121', 'Amy@gmail.com'); // three differences

test('Test user class: see if users are copies of each other.', () => {
  expect(user1.equals(user3)).toBe(false);
});

test('Test user class: see if users are copies of each other.', () => {
  expect(user1.equals(user4)).toBe(false);
});

test('Test user class: see if users are copies of each other.', () => {
  expect(user1.equals(user5)).toBe(false);
});
