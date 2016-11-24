'use strict';

var squel = require("squel");
var sql = require('../sql').posts;

module.exports = (rep, pgp) => {
    return {
        create: () =>
            rep.none(sql.create),
        add: post => {
          let sqlString = squel.insert().into("Posts").setFieldsRows([post]).toString() + ' RETURNING *';
          return rep.one(sqlString, post => post);
        },
        drop: () =>
            rep.none('DROP TABLE Posts'),
        empty: () =>
            rep.none('TRUNCATE TABLE Posts'),
        remove: id =>
            rep.result('DELETE FROM Posts WHERE id = $1', id, r => r.rowCount),
        find: id =>
            rep.oneOrNone('SELECT * FROM Posts WHERE id = $1', id),
        customFind: where =>
            rep.any('SELECT * FROM Posts ' + where),
        all: () =>
            rep.any('SELECT * FROM Posts'),
        total: () =>
            rep.one('SELECT count(*) FROM Posts', [], a => +a.count)
    };
};
