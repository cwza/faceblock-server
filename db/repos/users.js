'use strict';

const humps = require('humps');
const sql = require('../sql').users;
const logger = require('../../logger').logger;
const PARAMS = require('../../Constants').PARAMS;
const utils = require('../../utils');
const Joi = require('joi');

module.exports = (rep, pgp) => {
  const TABLE_NAME = 'users';
  const queryParamsSchema = Joi.object().keys({
    q: Joi.string().required(),
    sort: Joi.string().default(PARAMS.SORT.CREATE_TIME),
    order: Joi.string().default(PARAMS.ORDER.DESC),
    limit: Joi.number().integer().positive().default(5),
    page: Joi.number().integer().positive().default(1),
    underNearId: Joi.number().integer(),
    upperNearId: Joi.number().integer(),
  }).without('underNearId', 'upperNearId');
  const userAddSchema = Joi.object().keys({
    mail: Joi.string().email().required(),
  });
  const userUpdateSchema = Joi.object().keys({
    id: Joi.number().integer().positive().required(),
    mail: Joi.string().email().required(),
    createTime: Joi.date(),
    updateTime: Joi.date()
  });
  let createNamedParameterObject = (params) => {
    let namedParameterObject = utils.validateObjectBySchema(params, queryParamsSchema);
    namedParameterObject.q = humps.decamelize(namedParameterObject.q);
    namedParameterObject.sort = humps.decamelize(namedParameterObject.sort);
    namedParameterObject.orderReverse = namedParameterObject.order === PARAMS.ORDER.DESC ? PARAMS.ORDER.ASC : PARAMS.ORDER.DESC;
    namedParameterObject.offset = namedParameterObject.limit * (namedParameterObject.page - 1);
    return namedParameterObject;
  };
  return {
    add: user => {
      user = utils.validateObjectBySchema(user, userAddSchema);
      user = humps.decamelizeKeys(user);
      let sql = pgp.helpers.insert(user, null, TABLE_NAME) + ' returning *';
      return rep.one(sql).then(user => humps.camelizeKeys(user));
    },
    addMulti: users => {
      users = users.map(user => utils.validateObjectBySchema(user, userAddSchema));
      users = humps.decamelizeKeys(users);
      let sql = pgp.helpers.insert(users, Object.keys(users[0]), TABLE_NAME) + ' returning *';
      return rep.any(sql).then(users => humps.camelizeKeys(users));
    },
    update: user => {
      user = utils.validateObjectBySchema(user, userUpdateSchema);
      let { id } = user;
      user = utils.deletePropertiesFromObject(user, ['id', 'createTime', 'updateTime']);
      user.updateTime = 'NOW()';
      user = humps.decamelizeKeys(user);
      let sql = pgp.helpers.update(user, Object.keys(user), TABLE_NAME) + ' WHERE id = ' + id + ' returning *';
      return rep.one(sql).then(user => humps.camelizeKeys(user));
    },
    drop: () =>
      rep.none(`DROP TABLE ${TABLE_NAME}`),
    empty: () =>
      rep.none(`TRUNCATE TABLE ${TABLE_NAME} CASCADE`),
    remove: id =>
      rep.result(`DELETE FROM ${TABLE_NAME} WHERE id = $1`, id).then(r => r.rowCount),
    find: id =>
      rep.oneOrNone(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, id).then(user => humps.camelizeKeys(user)),
    findByMail: mail =>
      rep.oneOrNone(`SELECT * FROM ${TABLE_NAME} WHERE mail = $1`, mail).then(user => humps.camelizeKeys(user)),
    findByParamsWithoutNearId: (inputParams) => {
      let params = createNamedParameterObject(inputParams);
      logger.debug('sqlString for db.users.findByParamsWithoutNearId(): ', sql.findByParamsWithoutNearId.query, params);
      return rep.any(sql.findByParamsWithoutNearId, params).then(users => humps.camelizeKeys(users));
    },
    findByParamsWithUnderNearId: (inputParams) => {
      let params = createNamedParameterObject(inputParams);
      logger.debug('sqlString for db.users.findByParamsWithNearId(): ', sql.findByParamsWithUnderNearId.query, params);
      return rep.any(sql.findByParamsWithUnderNearId, params).then(users => humps.camelizeKeys(users));
    },
    findByParamsWithUpperNearId: (inputParams) => {
      let params = createNamedParameterObject(inputParams);
      logger.debug('sqlString for db.users.findByParamsWithNearId(): ', sql.findByParamsWithUpperNearId.query, params);
      return rep.any(sql.findByParamsWithUpperNearId, params).then(users => humps.camelizeKeys(users));
    },
    all: () =>
      rep.any(`SELECT * FROM ${TABLE_NAME}`).then(users => humps.camelizeKeys(users)),
    total: () =>
      rep.one(`SELECT count(*) FROM ${TABLE_NAME}`, []).then(a => +a.count)
  };
};
