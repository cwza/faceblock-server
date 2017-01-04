SELECT A.* FROM (
    SELECT zdb_score('users', t.ctid) AS score, t.*
    FROM
            users AS t
        JOIN
            ( SELECT ${sort:raw}
              FROM users
              WHERE id = ${upperNearId}
            ) AS o
          ON t.${sort:raw} = o.${sort:raw} AND t.id > ${upperNearId}
          OR t.${sort:raw} > o.${sort:raw}
    WHERE zdb('users', t.ctid) ==> ${q}
    ORDER BY
        t.${sort:raw} ${orderReverse:raw}, t.id DESC
      LIMIT ${limit} OFFSET ${offset}
) AS A ORDER BY A.${sort:raw} ${order:raw};
