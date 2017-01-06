SELECT A.* FROM (
    SELECT zdb_score('users', t.ctid) AS score, t.*
    FROM
            users AS t
        JOIN
            ( SELECT ${sort:name}
              FROM users
              WHERE id = ${upperNearId}
            ) AS o
          ON t.${sort:name} = o.${sort:name} AND t.id > ${upperNearId}
          OR t.${sort:name} > o.${sort:name}
    WHERE zdb('users', t.ctid) ==> ${q}
    ORDER BY
        t.${sort:name} ${orderReverse:raw}, t.id DESC
      LIMIT ${limit} OFFSET ${offset}
) AS A ORDER BY A.${sort:name} ${order:raw};
