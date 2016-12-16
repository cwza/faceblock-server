SELECT zdb_score('Posts', Posts.ctid) AS score, * FROM Posts
WHERE zdb('Posts', ctid) ==> ${q}
ORDER BY ${sort:raw} ${order:raw}, id DESC LIMIT ${limit} OFFSET ${offset}
