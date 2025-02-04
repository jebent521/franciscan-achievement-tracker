INSERT INTO users (name, email, password)
VALUES
    ('Angsty Alice', 'alice@angst.com', 'password123'),
    ('Boring Bob', 'bob@bored.com', 'password123'),
    ('Cranky Carol', 'carol@crank.com', 'password123');

INSERT INTO achievements (title, category, description, points)
VALUES
    ('Cafarrhea', 'General', 'Eat at the Caf', 10),
    ('The Grand Slam', 'Spiritual', 'Attend all four daily masses in one day', 100),
    ('Four years of B.S.', 'Academic', 'Be a STEM major', 20);


INSERT INTO user_achievements (user_id, achievement_id, date_achieved)
VALUES
    (1, 1, '2020-01-01'),
    (1, 2, '2020-01-02'),
    (1, 3, '2020-01-03'),
    (2, 1, '2020-01-01'),
    (2, 2, '2020-01-02'),
    (3, 1, '2020-01-01');