SELECT A.* FROM (
    SELECT zdb_score('posts', t.ctid) AS score, t.*
    FROM
            posts AS t
        JOIN
            ( SELECT ${sort:name}
              FROM posts
              WHERE id = ${upperNearId}
            ) AS o
          ON t.${sort:name} = o.${sort:name} AND t.id > ${upperNearId}
          OR t.${sort:name} > o.${sort:name}
    WHERE zdb('posts', t.ctid) ==> ${q}
    ORDER BY
        t.${sort:name} ${orderReverse:raw}, t.id DESC
      LIMIT ${limit} OFFSET ${offset}
) AS A ORDER BY A.${sort:name} ${order:raw};
