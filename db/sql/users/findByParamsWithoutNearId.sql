SELECT zdb_score('users', users.ctid) AS score, * FROM users
WHERE zdb('users', ctid) ==> ${q}
ORDER BY ${sort:raw} ${order:raw}, id DESC LIMIT ${limit} OFFSET ${offset}
