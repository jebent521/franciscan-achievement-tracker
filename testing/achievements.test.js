// How to include a class!
const achievements = require('../achievements');

const achievement = new achievements();

test ("Test achievements class default values: id", () => {
    expect(achievement.id).toBe(-1);
})

test ("Test achievements class default values: title", () => {
    expect(achievement.title).toBe("Empty Title");
})

test ("Test achievements class default values: category", () => {
    expect(achievement.category).toBe("No category");
})

test ("Test achievements class default values: description", () => {
    expect(achievement.description).toBe("Empty description");
})

test ("Test achievements class default values: prerequisite", () => {
    expect(achievement.prerequisite).toBe(null);
})

test ("Test achievements class default values: points", () => {
    expect(achievement.points).toBe(10);
})

test ("Test achievements class: overloading equals()", () => {
    const achievement2 = new achievements();
    const achievement3 = new achievements(1);
    expect(achievement2.equals(achievement3)).toBe(false);
})