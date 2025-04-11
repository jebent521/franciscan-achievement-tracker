CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    oauth_id VARCHAR(255) UNIQUE,
    points INTEGER DEFAULT 0,
    CHECK ((password IS NOT NULL AND oauth_id IS NULL) OR (password IS NULL AND oauth_id IS NOT NULL))
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE,
    description TEXT NOT NULL
);

CREATE TABLE group_members (
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, user_id)
);

CREATE TABLE group_officers (
    group_id INTEGER,
    user_id INTEGER,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id, user_id) REFERENCES group_members(group_id, user_id) ON DELETE CASCADE
);

CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    group_id INTEGER REFERENCES groups(id),
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