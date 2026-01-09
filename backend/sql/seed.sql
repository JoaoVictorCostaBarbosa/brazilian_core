INSERT INTO users (id, name, email, password)
VALUES (
    gen_random_uuid(),
    'Admin',
    'admin@email.com',
    '$argon2id$v=19$m=65536,t=3,p=4$FoOC27r4vHmPfoAYIempgg$JqgJQ4lb5HN6qQw6gsLw5/fI8EYLN8YxZE50iAxeElI'
);
