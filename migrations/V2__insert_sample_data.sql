INSERT INTO users (name, email, password)
VALUES
    ('Angsty Alice', 'alice@angst.com', 'password123'),
    ('Boring Bob', 'bob@bored.com', 'password123'),
    ('Cranky Carol', 'carol@crank.com', 'password123');

INSERT INTO achievements (title, category, description, prerequisite)
VALUES
    ('First Achievement', 'General', 'The first achievement', NULL),
    ('Second Achievement', 'General', 'The second achievement', 1),
    ('Third Achievement', 'General', 'The third achievement', 2);

INSERT INTO user_achievements (user_id, achievement_id, date_achieved)
VALUES
    (1, 1, '2020-01-01'),
    (1, 2, '2020-01-02'),
    (1, 3, '2020-01-03'),
    (2, 1, '2020-01-01'),
    (2, 2, '2020-01-02'),
    (3, 1, '2020-01-01');