SELECT A.* FROM (
    SELECT zdb_score('Posts', t.ctid) AS score, t.*
    FROM
            Posts AS t
        JOIN
            ( SELECT ${sort:raw}
              FROM Posts
              WHERE id = ${upperNearId}
            ) AS o
          ON t.${sort:raw} = o.${sort:raw} AND t.id > ${upperNearId}
          OR t.${sort:raw} > o.${sort:raw}
    WHERE zdb('Posts', t.ctid) ==> ${q}
    ORDER BY
        t.${sort:raw} ${orderReverse:raw}, t.id DESC
      LIMIT ${limit} OFFSET ${offset}
) AS A ORDER BY A.${sort:raw} ${order:raw};
