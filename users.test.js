// How to include a class!
const users = require('./users');

const user = new users();

test ("Test users class default values: username", () => {
    expect(user.username).toBe(null);
})

test ("Test users class default values: password", () => {
    expect(user.password).toBe(null);
})

test ("Test users class default values: email", () => {
    expect(user.email).toBe(null);
})

// Good data test
const user2 = new users("bobert24", "1234", "bob@gmail.com"); // the original
const user3 = new users("bobert24", "1234", "bob@gmail.com"); // the copy

test ("Test users class: see if users are copies of each other.", () => {
    expect (user2.equals(user3)).toBe(true);
})

// Bad data Test
const user4 = new users("Heartseeker", "1234", "bob@gmail.com"); // one difference
const user5 = new users("Heartseeker", "2121", "bob@gmail.com"); // two differences
const user6 = new users("Heartseeker", "2121", "Amy@gmail.com"); // three differences

test ("Test users class: see if users are copies of each other.", () => {
    expect (user2.equals(user4)).toBe(false);
})

test ("Test users class: see if users are copies of each other.", () => {
    expect (user2.equals(user5)).toBe(false);
})

test ("Test users class: see if users are copies of each other.", () => {
    expect (user2.equals(user6)).toBe(false);
})