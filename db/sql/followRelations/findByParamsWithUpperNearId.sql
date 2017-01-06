SELECT A.* FROM (
    SELECT zdb_score('follow_relations', t.ctid) AS score, t.*
    FROM
            follow_relations AS t
        JOIN
            ( SELECT ${sort:name}
              FROM follow_relations
              WHERE id = ${upperNearId}
            ) AS o
          ON t.${sort:name} = o.${sort:name} AND t.id > ${upperNearId}
          OR t.${sort:name} > o.${sort:name}
    WHERE zdb('follow_relations', t.ctid) ==> ${q}
    ORDER BY
        t.${sort:name} ${orderReverse:raw}, t.id DESC
      LIMIT ${limit} OFFSET ${offset}
) AS A ORDER BY A.${sort:name} ${order:raw};
