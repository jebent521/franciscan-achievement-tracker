CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    points INTEGER DEFAULT 0
);


CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    prerequisite INTEGER REFERENCES achievements(id) DEFAULT NULL,
    points INTEGER NOT NULL
);

CREATE TABLE user_achievements (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
    date_achieved DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (user_id, achievement_id)
);