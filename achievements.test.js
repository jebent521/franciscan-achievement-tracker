// How to include a class!
const achievements = require('./achievements');

const achievement = new achievements();

test ("Test achievements class default values: id", () => {
    //toBeInstanceOf
    expect(achievement.id).toBe(-1);
})

test ("Test achievements class default values: title", () => {
    //toBeInstanceOf
    expect(achievement.title).toBe("Empty Title");
})

test ("Test achievements class default values: category", () => {
    //toBeInstanceOf
    expect(achievement.category).toBe("No category");
})

test ("Test achievements class default values: description", () => {
    //toBeInstanceOf
    expect(achievement.description).toBe("Empty description");
})

test ("Test achievements class default values: prerequisite", () => {
    //toBeInstanceOf
    expect(achievement.prerequisite).toBe(null);
})

test ("Test achievements class default values: points", () => {
    //toBeInstanceOf
    expect(achievement.points).toBe(10);
})

test ("Test achievements class: overloading valueOf()", () => {
    expect(achievement.valueOf()).toBe(achievement.points);
})

test ("Test achievements class: overloading equals()", () => {
    //toBeInstanceOf
    const achievement2 = new achievements();
    const achievement3 = new achievements(1);
    expect(achievement2.equals(achievement3)).toBe(false);
})