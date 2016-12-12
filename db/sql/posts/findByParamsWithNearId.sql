SELECT zdb_score('Posts', t.ctid) AS score, t.*
FROM
        Posts AS t
    JOIN
        ( SELECT ${sort:raw}
          FROM Posts
          WHERE id = ${nearId}
        ) AS o
      ON t.${sort:raw} = o.${sort:raw} AND t.id < ${nearId}
      OR t.${sort:raw} ${nearCondition:raw} o.${sort:raw}
WHERE zdb('Posts', t.ctid) ==> ${q}
ORDER BY
    t.${sort:raw} ${order:raw}, t.id ASC
  LIMIT ${limit} OFFSET ${offset};



-- SELECT t.*
-- FROM
--         posts AS t
--     JOIN
--         ( SELECT content
--           FROM posts
--           WHERE id = 4
--         ) AS o
--       ON t.content = o.content AND t.id < 4 
--       OR t.content < o.content
-- ORDER BY
--     t.content DESC, t.id DESC
--   LIMIT 5 ;
