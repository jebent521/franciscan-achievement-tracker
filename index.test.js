import Achievements from "./index.js";

test ("Create a proper achievement", () => {
    const first = new Achievements(1, 'The Source and The Summit', "Franny Basics", 'Attend Mass on Campus', null, 10);
    expect(first).toBe(true);
})