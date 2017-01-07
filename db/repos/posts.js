'use strict';

const humps = require('humps');
const sql = require('../sql').posts;
const PARAMS = require('../../Constants').PARAMS;
const utils = require('../../utils');
const logger = require('../../logger').logger;

module.exports = (rep, pgp) => {
  const TABLE_NAME = 'posts';
  let createNamedParameterObject = (params) => {
    let namedParameterObject = Object.assign({}, params);
    namedParameterObject.q = humps.decamelize(namedParameterObject.q);
    namedParameterObject.sort = humps.decamelize(namedParameterObject.sort);
    namedParameterObject.orderReverse = namedParameterObject.order === PARAMS.ORDER.DESC ? PARAMS.ORDER.ASC : PARAMS.ORDER.DESC;
    namedParameterObject.offset = namedParameterObject.limit * (namedParameterObject.page - 1);
    return namedParameterObject;
  };
  return {
    add: post => {
      post = humps.decamelizeKeys(post);
      let sql = pgp.helpers.insert(post, null, TABLE_NAME) + ' returning *';
      return rep.one(sql);
    },
    addMulti: posts => {
      posts = humps.decamelizeKeys(posts);
      let sql = pgp.helpers.insert(posts, Object.keys(posts[0]), TABLE_NAME) + ' returning *';
      return rep.any(sql);
    },
    update: post => {
      let { id } = post;
      post = utils.deletePropertiesFromObject(post, ['id', 'createTime', 'updateTime']);
      post.updateTime = 'NOW()';
      post = humps.decamelizeKeys(post);
      let sql = pgp.helpers.update(post, Object.keys(post), TABLE_NAME) + ' WHERE id = ' + id + ' returning *';
      return rep.one(sql);
    },
    drop: () =>
      rep.none(`DROP TABLE ${TABLE_NAME}`),
    empty: () =>
      rep.none(`TRUNCATE TABLE ${TABLE_NAME} CASCADE`),
    remove: id =>
      rep.result(`DELETE FROM ${TABLE_NAME} WHERE id = $1`, id, r => r.rowCount),
    find: id =>
      rep.oneOrNone(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, id),
    findByParamsWithoutNearId: (inputParams) => {
      let params = createNamedParameterObject(inputParams);
      logger.debug('sqlString for db.posts.findByParamsWithoutNearId(): ', sql.findByParamsWithoutNearId.query, params);
      return rep.any(sql.findByParamsWithoutNearId, params);
      // return rep.task('findByParamsWithoutNearId', t => {
      //   return t.map(sql.findByParamsWithoutNearId, params, post => {
      //     return t.one('SELECT * FROM users WHERE id = $1', post.user_id)
      //       .then(user => {
      //         post.user = user;
      //         return post;
      //       });
      //   }).then(t.batch);
      // });
    },
    findByParamsWithUnderNearId: (inputParams) => {
      let params = createNamedParameterObject(inputParams);
      logger.debug('sqlString for db.posts.findByParamsWithNearId(): ', sql.findByParamsWithUnderNearId.query, params);
      return rep.any(sql.findByParamsWithUnderNearId, params);
      // return rep.task('findByParamsWithUnderNearId', t => {
      //   return t.map(sql.findByParamsWithUnderNearId, params, post => {
      //     return t.one('SELECT * FROM users WHERE id = $1', post.user_id)
      //       .then(user => {
      //         post.user = user;
      //         return post;
      //       });
      //   }).then(t.batch);
      // });
    },
    findByParamsWithUpperNearId: (inputParams) => {
      let params = createNamedParameterObject(inputParams);
      logger.debug('sqlString for db.posts.findByParamsWithNearId(): ', sql.findByParamsWithUpperNearId.query, params);
      return rep.any(sql.findByParamsWithUpperNearId, params);
      // return rep.task('findByParamsWithUpperNearId', t => {
      //   return t.map(sql.findByParamsWithUpperNearId, params, post => {
      //     return t.one('SELECT * FROM users WHERE id = $1', post.user_id)
      //       .then(user => {
      //         post.user = user;
      //         return post;
      //       });
      //   }).then(t.batch);
      // });
    },
    all: () =>
      rep.any(`SELECT * FROM ${TABLE_NAME}`),
    total: () =>
      rep.one(`SELECT count(*) FROM ${TABLE_NAME}`, [], a => +a.count) // `+` is short for `parseInt()`, transform string to int, because of 64bit int returned from postgres
  };
};
