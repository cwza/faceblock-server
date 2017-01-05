SELECT zdb_score('follow_relations', follow_relations.ctid) AS score, * FROM follow_relations
WHERE zdb('follow_relations', ctid) ==> ${q}
ORDER BY ${sort:raw} ${order:raw}, id DESC LIMIT ${limit} OFFSET ${offset}
