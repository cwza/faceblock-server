SELECT A.* FROM (
    SELECT zdb_score('posts', t.ctid) AS score, t.*
    FROM
            posts AS t
        JOIN
            ( SELECT ${sort:raw}
              FROM posts
              WHERE id = ${upperNearId}
            ) AS o
          ON t.${sort:raw} = o.${sort:raw} AND t.id > ${upperNearId}
          OR t.${sort:raw} > o.${sort:raw}
    WHERE zdb('posts', t.ctid) ==> ${q}
    ORDER BY
        t.${sort:raw} ${orderReverse:raw}, t.id DESC
      LIMIT ${limit} OFFSET ${offset}
) AS A ORDER BY A.${sort:raw} ${order:raw};
