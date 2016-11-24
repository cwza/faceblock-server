BEGIN;
CREATE TABLE Users
(
    id serial PRIMARY KEY,
    mail text NOT NULL
);

CREATE TABLE Posts
(
    id serial PRIMARY KEY,
    userid int not null references Users(id),
    content text NOT NULL
);
COMMIT;
