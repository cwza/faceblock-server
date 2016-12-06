'use strict';

const squel = require("squel").useFlavour('postgres');
const sql = require('../sql').users;
const logger = require('../../logger').logger;

module.exports = (rep, pgp) => {
  const TABLE_NAME = 'Users';
  return {
    create: () =>
      rep.none(sql.create),
    init: () =>
      rep.tx('Demo-Users', t => t.map(sql.init, null, row => row.id)),
    add: user => {
      let sql = squel.insert().into(TABLE_NAME).setFieldsRows([user]).returning('*');
      return rep.one(sql.toString(), user => user);
    },
    multiAdd: users => {
      let sql = squel.insert().into(TABLE_NAME).setFieldsRows(users).returning('*');
      return rep.any(sql.toString(), users => users);
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
