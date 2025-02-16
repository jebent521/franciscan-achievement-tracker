// How to include a class!
const Achievement = require('../../src/models/achievement');

test("Test achievements class: overloading equals()", () => {
    const achievement1 = new Achievement();
    const achievement2 = new Achievement();
    expect(achievement1.equals(achievement2)).toBe(true);
})