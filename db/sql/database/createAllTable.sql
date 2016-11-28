BEGIN;
CREATE TABLE Users
(
    id serial PRIMARY KEY,
    mail text NOT NULL UNIQUE,
    create_time timestamp default current_timestamp,
    update_time timestamp default current_timestamp
);

CREATE TABLE Posts
(
    id serial PRIMARY KEY,
    userid int not null references Users(id) ON DELETE CASCADE,
    content text NOT NULL,
    create_time timestamp default current_timestamp,
    update_time timestamp default current_timestamp
);
COMMIT;
