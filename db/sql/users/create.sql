/*
    Creates table Users.
*/

CREATE TABLE ${schema~}.users
(
    id serial PRIMARY KEY,
    mail text NOT NULL
);
