BEGIN;
CREATE EXTENSION IF NOT EXISTS zombodb;
CREATE TABLE IF NOT EXISTS users
(
    id serial PRIMARY KEY,
    mail text NOT NULL UNIQUE,
    create_time timestamp default current_timestamp,
    update_time timestamp default current_timestamp
);
CREATE INDEX IF NOT EXISTS idx_zdb_users
          ON users
       USING zombodb(zdb('users', ctid), zdb(users))
        WITH (url='http://docker_zombodb_elastic_1:9200/');
CREATE TABLE IF NOT EXISTS posts
(
    id serial PRIMARY KEY,
    user_id int not null references users(id) ON DELETE CASCADE,
    content text NOT NULL,
    reply_to int references posts(id) ON DELETE CASCADE,
    create_time timestamp default current_timestamp,
    update_time timestamp default current_timestamp
);
CREATE INDEX IF NOT EXISTS idx_zdb_posts
          ON posts
       USING zombodb(zdb('posts', ctid), zdb(posts))
        WITH (url='http://docker_zombodb_elastic_1:9200/');
COMMIT;
