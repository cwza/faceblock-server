/*
    Creates table Posts.

    NOTE: We only add schema here to demonstrate the ability of class QueryFile
    to pre-format SQL with static formatting parameters when needs to be.
*/

CREATE TABLE ${schema~}.Posts
(
    id serial PRIMARY KEY,
    userid int not null references Users(id),
    content text NOT NULL
);
