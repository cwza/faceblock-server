/*
    Creates table Users.
*/

CREATE TABLE ${schema~}.Users
(
    id serial PRIMARY KEY,
    mail text NOT NULL
);
