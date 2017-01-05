SELECT zdb_score('follow_relations', t.ctid) AS score, t.*
FROM
        follow_relations AS t
    JOIN
        ( SELECT ${sort:raw}
          FROM follow_relations
          WHERE id = ${underNearId}
        ) AS o
      ON t.${sort:raw} = o.${sort:raw} AND t.id < ${underNearId}
      OR t.${sort:raw} < o.${sort:raw}
WHERE zdb('follow_relations', t.ctid) ==> ${q}
ORDER BY
    t.${sort:raw} ${order:raw}, t.id DESC
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
