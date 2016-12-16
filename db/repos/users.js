'use strict';

const humps = require('humps');
const sql = require('../sql').users;
const logger = require('../../logger').logger;
const Joi = require('joi');
const utils = require('../../utils');

module.exports = (rep, pgp) => {
  const TABLE_NAME = 'users';
  const userAddSchema = Joi.object().keys({
    mail: Joi.string().email().required(),
  });
  return {
    create: () =>
      rep.none(sql.create),
    init: () =>
      rep.tx('Demo-Users', t => t.map(sql.init, null, row => row.id)),
    add: user => {
      user = utils.validateObjectBySchema(user, userAddSchema);
      user = humps.decamelizeKeys(user);
      let sql = pgp.helpers.insert(user, null, TABLE_NAME) + ' returning *';
      return rep.one(sql.toString(), user => humps.camelizeKeys(user));
    },
    multiAdd: users => {
      users = users.map(user => utils.validateObjectBySchema(user, userAddSchema));
      users = humps.decamelizeKeys(users);
      let sql = pgp.helpers.insert(users, Object.keys(users[0]), TABLE_NAME) + ' returning *';
      return rep.any(sql.toString()).then(users => humps.camelizeKeys(users));
    },
    drop: () =>
      rep.none(`DROP TABLE ${TABLE_NAME}`),
    empty: () =>
      rep.none(`TRUNCATE TABLE ${TABLE_NAME} CASCADE`),
    remove: id =>
      rep.result(`DELETE FROM ${TABLE_NAME} WHERE id = $1`, id, r => r.rowCount),
    find: id =>
      rep.oneOrNone(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, id, user => humps.camelizeKeys(user)),
    all: () =>
      rep.any(`SELECT * FROM ${TABLE_NAME}`).then(users => humps.camelizeKeys(users)),
    total: () =>
      rep.one(`SELECT count(*) FROM ${TABLE_NAME}`, [], a => +a.count)
  };
};
