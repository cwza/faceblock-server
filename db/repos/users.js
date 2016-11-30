'use strict';

const squel = require("squel");
const sql = require('../sql').users;

module.exports = (rep, pgp) => {
  const TABLE_NAME = 'Users';
  return {
    create: () =>
      rep.none(sql.create),
    init: () =>
      rep.tx('Demo-Users', t => t.map(sql.init, null, row => row.id)),
    add: user => {
      let sqlString = squel.insert().into(TABLE_NAME).setFieldsRows([user]).toString() + ' RETURNING *';
      return rep.one(sqlString, user => user);
    },
    drop: () =>
      rep.none(`DROP TABLE ${TABLE_NAME}`),
    empty: () =>
      rep.none(`TRUNCATE TABLE ${TABLE_NAME} CASCADE`),
    remove: id =>
      rep.result(`DELETE FROM ${TABLE_NAME} WHERE id = $1`, id, r => r.rowCount),
    find: id =>
      rep.oneOrNone(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, id),
    customFind: where =>
      rep.any(`SELECT * FROM ${TABLE_NAME} ` + where),
    all: () =>
      rep.any(`SELECT * FROM ${TABLE_NAME}`),
    total: () =>
      rep.one(`SELECT count(*) FROM ${TABLE_NAME}`, [], a => +a.count)
  };
};
