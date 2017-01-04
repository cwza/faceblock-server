'use strict';

const humps = require('humps');
const sql = require('../sql').posts;
const PARAMS = require('../../Constants').PARAMS;
const utils = require('../../utils');
const logger = require('../../logger').logger;
const Joi = require('joi');

module.exports = (rep, pgp) => {
  const TABLE_NAME = 'posts';
  const queryParamsSchema = Joi.object().keys({
    q: Joi.string().required(),
    sort: Joi.string().default(PARAMS.SORT.CREATE_TIME),
    order: Joi.string().default(PARAMS.ORDER.DESC),
    limit: Joi.number().integer().positive().default(5),
    page: Joi.number().integer().positive().default(1),
    underNearId: Joi.number().integer(),
    upperNearId: Joi.number().integer(),
  }).without('underNearId', 'upperNearId');
  const postAddSchema = Joi.object().keys({
    userId: Joi.number().integer().positive().required(),
    content: Joi.string().required(),
    replyTo: Joi.number().integer().positive().allow(null),
  });
  const postUpdateSchema = Joi.object().keys({
    id: Joi.number().integer().positive().required(),
    userId: Joi.number().integer().positive().required(),
    content: Joi.string().required(),
    replyTo: Joi.number().integer().positive().allow(null),
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
    create: () =>
      rep.none(sql.create),
    add: post => {
      post = utils.validateObjectBySchema(post, postAddSchema);
      post = humps.decamelizeKeys(post);
      let sql = pgp.helpers.insert(post, null, TABLE_NAME) + ' returning *';
      return rep.one(sql, post => humps.camelizeKeys(post));
    },
    addMulti: posts => {
      posts = posts.map(post => utils.validateObjectBySchema(post, postAddSchema));
      posts = humps.decamelizeKeys(posts);
      let sql = pgp.helpers.insert(posts, Object.keys(posts[0]), TABLE_NAME) + ' returning *';
      return rep.any(sql.toString()).then(posts => humps.camelizeKeys(posts));
    },
    update: post => {
      post = utils.validateObjectBySchema(post, postUpdateSchema);
      let { id } = post;
      post = utils.deletePropertiesFromObject(post, ['id', 'createTime', 'updateTime']);
      post.updateTime = 'NOW()';
      post = humps.decamelizeKeys(post);
      let sql = pgp.helpers.update(post, Object.keys(post), TABLE_NAME) + ' WHERE id = ' + id + ' returning *';
      return rep.one(sql, post => humps.camelizeKeys(post));
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
      // return rep.task('findByParamsWithoutNearId', t => {
      //   return t.map(sql.findByParamsWithoutNearId, params, post => {
      //     return t.one('SELECT * FROM users WHERE id = $1', post.user_id)
      //       .then(user => {
      //         post.user = user;
      //         return humps.camelizeKeys(post);
      //       });
      //   }).then(t.batch);
      // });
    },
    findByParamsWithUnderNearId: (inputParams) => {
      let params = createNamedParameterObject(inputParams);
      logger.debug('sqlString for db.posts.findByParamsWithNearId(): ', sql.findByParamsWithUnderNearId.query, params);
      return rep.any(sql.findByParamsWithUnderNearId, params).then(posts => humps.camelizeKeys(posts));
      // return rep.task('findByParamsWithUnderNearId', t => {
      //   return t.map(sql.findByParamsWithUnderNearId, params, post => {
      //     return t.one('SELECT * FROM users WHERE id = $1', post.user_id)
      //       .then(user => {
      //         post.user = user;
      //         return humps.camelizeKeys(post);
      //       });
      //   }).then(t.batch);
      // });
    },
    findByParamsWithUpperNearId: (inputParams) => {
      let params = createNamedParameterObject(inputParams);
      logger.debug('sqlString for db.posts.findByParamsWithNearId(): ', sql.findByParamsWithUpperNearId.query, params);
      return rep.any(sql.findByParamsWithUpperNearId, params).then(posts => humps.camelizeKeys(posts));
      // return rep.task('findByParamsWithUpperNearId', t => {
      //   return t.map(sql.findByParamsWithUpperNearId, params, post => {
      //     return t.one('SELECT * FROM users WHERE id = $1', post.user_id)
      //       .then(user => {
      //         post.user = user;
      //         return humps.camelizeKeys(post);
      //       });
      //   }).then(t.batch);
      // });
    },
    all: () =>
      rep.any(`SELECT * FROM ${TABLE_NAME}`).then(posts => humps.camelizeKeys(posts)),
    total: () =>
      rep.one(`SELECT count(*) FROM ${TABLE_NAME}`, [], a => +a.count)
  };
};
