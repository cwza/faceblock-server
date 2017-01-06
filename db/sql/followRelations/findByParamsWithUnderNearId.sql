SELECT zdb_score('follow_relations', t.ctid) AS score, t.*
FROM
        follow_relations AS t
    JOIN
        ( SELECT ${sort:name}
          FROM follow_relations
          WHERE id = ${underNearId}
        ) AS o
      ON t.${sort:name} = o.${sort:name} AND t.id < ${underNearId}
      OR t.${sort:name} < o.${sort:name}
WHERE zdb('follow_relations', t.ctid) ==> ${q}
ORDER BY
    t.${sort:name} ${order:raw}, t.id DESC
  LIMIT ${limit} OFFSET ${offset};



-- SELECT t.*
-- FROM
--         follow_relations AS t
--     JOIN
--         ( SELECT content
--           FROM follow_relations
--           WHERE id = 4
--         ) AS o
--       ON t.content = o.content AND t.id < 4
--       OR t.content < o.content
-- ORDER BY
--     t.content DESC, t.id DESC
--   LIMIT 5 ;
