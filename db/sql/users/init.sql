/*
    Inserting a few demo users into the database, and returning their id-s;

    NOTES:

    - You can do multiple separate inserts, if you want, but using
      a single concatenated insert is significantly faster.

    - We only add schema here to demonstrate the ability of class QueryFile
      to pre-format SQL with static formatting parameters when needs to be.

    See also:
    https://github.com/vitaly-t/pg-promise/wiki/Performance-Boost

*/

INSERT INTO ${schema~}.users(mail) VALUES
('Test user 1'), -- user 1;
('Test user 2'), -- user 2;
('Test user 3'), -- user 3;
('Test user 4'), -- user 4;
('Test user 5') -- user 5;
RETURNING id
