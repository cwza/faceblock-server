SELECT zdb_score('posts', posts.ctid) AS score, * FROM posts
WHERE zdb('posts', ctid) ==> ${q}
ORDER BY ${sort:name} ${order:raw}, id DESC LIMIT ${limit} OFFSET ${offset}
