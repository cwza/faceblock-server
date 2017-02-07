'use strict';

const humps = require('humps');
const sql = require('../sql').followRelations;
const PARAMS = require('../../Constants').PARAMS;
const logger = require('../../logger').logger;
const utils = require('../../utils');

module.exports = (rep, pgp) => {
  const TABLE_NAME = 'follow_relations';
  let createNamedParameterObject = (params) => {
    let namedParameterObject = Object.assign({}, params);
    namedParameterObject.q = humps.decamelize(namedParameterObject.q.toString());
    namedParameterObject.sort = humps.decamelize(namedParameterObject.sort);
    namedParameterObject.orderReverse = namedParameterObject.order === PARAMS.ORDER.DESC ? PARAMS.ORDER.ASC : PARAMS.ORDER.DESC;
    namedParameterObject.offset = namedParameterObject.limit * (namedParameterObject.page - 1);
    return namedParameterObject;
  };
  return {
    add: followRelation => {
      followRelation = humps.decamelizeKeys(followRelation);
      let sql = pgp.helpers.insert(followRelation, null, TABLE_NAME) + ' returning *';
      return rep.one(sql);
    },
    addMulti: followRelations => {
      followRelations = humps.decamelizeKeys(followRelations);
      let sql = pgp.helpers.insert(followRelations, Object.keys(followRelations[0]), TABLE_NAME) + ' returning *';
      return rep.any(sql);
    },
    update: followRelation => {
      let { id } = followRelation;
      followRelation = utils.deletePropertiesFromObject(followRelation, ['id', 'createTime', 'updateTime']);
      followRelation.updateTime = 'NOW()';
      followRelation = humps.decamelizeKeys(followRelation);
      let sql = pgp.helpers.update(followRelation, Object.keys(followRelation), TABLE_NAME) + ' WHERE id = ' + id + ' returning *';
      return rep.one(sql);
    },
    drop: () =>
      rep.none(`DROP TABLE ${TABLE_NAME}`),
    empty: () =>
      rep.none(`TRUNCATE TABLE ${TABLE_NAME} CASCADE`),
    remove: id =>
      rep.result(`DELETE FROM ${TABLE_NAME} WHERE id = $1`, id, r => r.rowCount),
    removeByRelation: (userId, followerId) =>
      rep.result(`DELETE FROM ${TABLE_NAME} WHERE user_id = $1 AND follower_id = $2`, [userId, followerId]),
    find: id =>
      rep.oneOrNone(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, id),
    findByUserId: userId =>
      rep.any(`SELECT * FROM ${TABLE_NAME} WHERE user_id = $1`, userId),
    findByFollowerId: followerId =>
      rep.any(`SELECT * FROM ${TABLE_NAME} WHERE follower_id = $1`, followerId),
    findByRelation: (userId, followerId) =>
      rep.oneOrNone(`SELECT * FROM ${TABLE_MAME} WHERE user_id = $1 and follower_id = $2`, [userId, followerId]),
    findByParamsWithoutNearId: (inputParams) => {
      let params = createNamedParameterObject(inputParams);
      logger.debug('sqlString for db.followRelations.findByParamsWithoutNearId(): ', sql.findByParamsWithoutNearId.query, params);
      return rep.any(sql.findByParamsWithoutNearId, params);
    },
    findByParamsWithUnderNearId: (inputParams) => {
      let params = createNamedParameterObject(inputParams);
      logger.debug('sqlString for db.followRelations.findByParamsWithNearId(): ', sql.findByParamsWithUnderNearId.query, params);
      return rep.any(sql.findByParamsWithUnderNearId, params);
    },
    findByParamsWithUpperNearId: (inputParams) => {
      let params = createNamedParameterObject(inputParams);
      logger.debug('sqlString for db.followRelations.findByParamsWithNearId(): ', sql.findByParamsWithUpperNearId.query, params);
      return rep.any(sql.findByParamsWithUpperNearId, params);
    },
    all: () =>
      rep.any(`SELECT * FROM ${TABLE_NAME}`),
    total: () =>
      rep.one(`SELECT count(*) FROM ${TABLE_NAME}`, [], a => +a.count)
  };
};
