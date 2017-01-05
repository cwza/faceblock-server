SELECT A.* FROM (
    SELECT zdb_score('follow_relations', t.ctid) AS score, t.*
    FROM
            follow_relations AS t
        JOIN
            ( SELECT ${sort:raw}
              FROM follow_relations
              WHERE id = ${upperNearId}
            ) AS o
          ON t.${sort:raw} = o.${sort:raw} AND t.id > ${upperNearId}
          OR t.${sort:raw} > o.${sort:raw}
    WHERE zdb('follow_relations', t.ctid) ==> ${q}
    ORDER BY
        t.${sort:raw} ${orderReverse:raw}, t.id DESC
      LIMIT ${limit} OFFSET ${offset}
) AS A ORDER BY A.${sort:raw} ${order:raw};
