'use strict';

const PQ = require('pg-promise').ParameterizedQuery;
const squel = require('squel').useFlavour('postgres');
const humps = require('humps');
const sql = require('../sql').posts;
const PARAMS = require('../../Constants').PARAMS;
const utils = require('../../utils');
const logger = require('../../logger').logger;

module.exports = (rep, pgp) => {
  const TABLE_NAME = 'Posts';
  let defaultQueryParams = {
    q: '',
    sort: PARAMS.SORT.CREATE_TIME,
    order: PARAMS.ORDER.DESC,
    limit: 5,
    page: 1,
    underNearId: 0,
    upperNearId: 0,
    orderReverse: function() { return this.order === PARAMS.ORDER.DESC ? PARAMS.ORDER.ASC : PARAMS.ORDER.DESC },
    offset: function() { return this.limit * (this.page - 1); },
  };
  let createNamedParameterObject = (params) => {
    let result = utils.interMergeObject(params, defaultQueryParams);
    result.q = humps.decamelize(result.q);
    result.sort = humps.decamelize(result.sort);
    result.offset = result.offset();
    result.orderReverse = result.orderReverse();
    return result;
  }
  return {
    defaultQueryParams,
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
    findByParamsWithoutNearId: (inputParams = defaultQueryParams) => {
      let params = createNamedParameterObject(inputParams);
      logger.debug('sqlString for db.posts.findByParamsWithoutNearId(): ', sql.findByParamsWithoutNearId.query, params);
      return rep.any(sql.findByParamsWithoutNearId, params).then(posts => humps.camelizeKeys(posts));
    },
    findByParamsWithUnderNearId: (inputParams = defaultQueryParams) => {
      let params = createNamedParameterObject(inputParams);
      logger.debug('sqlString for db.posts.findByParamsWithNearId(): ', sql.findByParamsWithUnderNearId.query, params);
      return rep.any(sql.findByParamsWithUnderNearId, params).then(posts => humps.camelizeKeys(posts));
    },
    findByParamsWithUpperNearId: (inputParams = defaultQueryParams) => {
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
