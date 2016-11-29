'use strict';

const squel = require("squel");
const sql = require('../sql').users;

module.exports = (rep, pgp) => {
    return {
        create: () =>
            rep.none(sql.create),
        init: () =>
            rep.tx('Demo-Users', t => t.map(sql.init, null, row => row.id)),
        add: user => {
          let sqlString = squel.insert().into("Users").setFieldsRows([user]).toString() + ' RETURNING *';
          return rep.one(sqlString, user => user);
        },
        drop: () =>
            rep.none('DROP TABLE Users'),
        empty: () =>
            rep.none('TRUNCATE TABLE Users CASCADE'),
        remove: id =>
            rep.result('DELETE FROM Users WHERE id = $1', id, r => r.rowCount),
        find: id =>
            rep.oneOrNone('SELECT * FROM Users WHERE id = $1', id),
        customFind: where =>
            rep.any('SELECT * FROM Users ' + where),
        all: () =>
            rep.any('SELECT * FROM Users'),
        total: () =>
            rep.one('SELECT count(*) FROM Users', [], a => +a.count)
    };
};
