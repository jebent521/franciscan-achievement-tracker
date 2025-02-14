// How to include a class!
const achievements = require('./achievements');

test ("Test achievements class", () => {
    const achievement = new achievements(1);
    //toBeInstanceOf
    expect(achievement.id).toBe(1);
})