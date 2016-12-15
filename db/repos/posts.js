'use strict';

const squel = require('squel').useFlavour('postgres');
const humps = require('humps');
const sql = require('../sql').posts;
const PARAMS = require('../../Constants').PARAMS;
const utils = require('../../utils');
const logger = require('../../logger').logger;
const Joi = require('joi');

module.exports = (rep, pgp) => {
  const TABLE_NAME = 'Posts';
  const queryParamsSchema = Joi.object().keys({
    q: Joi.string().required(),
    sort: Joi.string().default(PARAMS.SORT.CREATE_TIME),
    order: Joi.string().default(PARAMS.ORDER.DESC),
    limit: Joi.number().integer().positive().default(5),
    page: Joi.number().integer().positive().default(1),
    underNearId: Joi.number().integer(),
    upperNearId: Joi.number().integer(),
  }).without('underNearId', 'upperNearId');
  let createNamedParameterObject = (params) => {
    let namedParameterObject = utils.validateObjectBySchema(params, queryParamsSchema);
    namedParameterObject.q = humps.decamelize(namedParameterObject.q);
    namedParameterObject.sort = humps.decamelize(namedParameterObject.sort);
    namedParameterObject.orderReverse = namedParameterObject.order === PARAMS.ORDER.DESC ? PARAMS.ORDER.ASC : PARAMS.ORDER.DESC;
    namedParameterObject.offset = namedParameterObject.limit * (namedParameterObject.page - 1);
    return namedParameterObject;
  }
  return {
    create: () =>
      rep.none(sql.create),
    add: post => {
      post = humps.decamelizeKeys(post);
      let sql = squel.insert().into(TABLE_NAME).setFieldsRows([post]).returning('*');
      return rep.one(sql.toString(), post => humps.camelizeKeys(post));
    },
    addMulti: posts => {
      posts = humps.decamelizeKeys(posts);
      let sql = squel.insert().into(TABLE_NAME).setFieldsRows(posts).returning('*');
      return rep.any(sql.toString()).then(posts => humps.camelizeKeys(posts));
    },
    update: post => {
      let { id } = post;
      post = utils.deletePropertiesFromObject(post, ['id', 'createTime', 'updateTime']);
      post = humps.decamelizeKeys(post);
      let sql = squel.update().table(TABLE_NAME).set('update_time', 'NOW()').setFields(post).where(`id = ${id}`).returning('*');
      console.log('update post sqlString: ', sql.toString());
      return rep.one(sql.toString(), post => humps.camelizeKeys(post));
    },
    drop: () =>
      rep.none(`DROP TABLE ${TABLE_NAME}`),
    empty: () =>
      rep.none(`TRUNCATE TABLE ${TABLE_NAME} CASCADE`),
    remove: id =>
      rep.result(`DELETE FROM ${TABLE_NAME} WHERE id = $1`, id, r => r.rowCount),
    find: id =>
      rep.oneOrNone(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, id, post => humps.camelizeKeys(post)),
    findByParamsWithoutNearId: (inputParams) => {
      let params = createNamedParameterObject(inputParams);
      logger.debug('sqlString for db.posts.findByParamsWithoutNearId(): ', sql.findByParamsWithoutNearId.query, params);
      return rep.any(sql.findByParamsWithoutNearId, params).then(posts => humps.camelizeKeys(posts));
    },
    findByParamsWithUnderNearId: (inputParams) => {
      let params = createNamedParameterObject(inputParams);
      logger.debug('sqlString for db.posts.findByParamsWithNearId(): ', sql.findByParamsWithUnderNearId.query, params);
      return rep.any(sql.findByParamsWithUnderNearId, params).then(posts => humps.camelizeKeys(posts));
    },
    findByParamsWithUpperNearId: (inputParams) => {
      let params = createNamedParameterObject(inputParams);
      logger.debug('sqlString for db.posts.findByParamsWithNearId(): ', sql.findByParamsWithUpperNearId.query, params);
      return rep.any(sql.findByParamsWithUpperNearId, params).then(posts => humps.camelizeKeys(posts));
    },
    all: () =>
      rep.any(`SELECT * FROM ${TABLE_NAME}`).then(posts => humps.camelizeKeys(posts)),
    total: () =>
      rep.one(`SELECT count(*) FROM ${TABLE_NAME}`, [], a => +a.count)
  };
};
