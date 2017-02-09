const humps = require('humps');
const sql = require('../sql').users;
const logger = require('../../logger').logger;
const PARAMS = require('../../Constants').PARAMS;
const utils = require('../../utils');

module.exports = (rep, pgp) => {
  const TABLE_NAME = 'users';
  let createNamedParameterObject = (params) => {
    let namedParameterObject = Object.assign({}, params);
    namedParameterObject.q = humps.decamelize(namedParameterObject.q.toString());
    namedParameterObject.sort = humps.decamelize(namedParameterObject.sort);
    namedParameterObject.orderReverse = namedParameterObject.order === PARAMS.ORDER.DESC ? PARAMS.ORDER.ASC : PARAMS.ORDER.DESC;
    namedParameterObject.offset = namedParameterObject.limit * (namedParameterObject.page - 1);
    return namedParameterObject;
  };
  return {
    add: user => {
      user = humps.decamelizeKeys(user);
      let sql = pgp.helpers.insert(user, null, TABLE_NAME) + ' returning *';
      return rep.one(sql);
    },
    addMulti: users => {
      users = humps.decamelizeKeys(users);
      let sql = pgp.helpers.insert(users, Object.keys(users[0]), TABLE_NAME) + ' returning *';
      return rep.any(sql);
    },
    update: user => {
      let { id } = user;
      user = utils.deletePropertiesFromObject(user, ['id', 'createTime', 'updateTime']);
      user.updateTime = 'NOW()';
      user = humps.decamelizeKeys(user);
      let sql = pgp.helpers.update(user, Object.keys(user), TABLE_NAME) + ' WHERE id = ' + id + ' returning *';
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
    findByMail: mail =>
      rep.oneOrNone(`SELECT * FROM ${TABLE_NAME} WHERE mail = $1`, mail),
    findByParamsWithoutNearId: (inputParams) => {
      let params = createNamedParameterObject(inputParams);
      logger.debug('sqlString for db.users.findByParamsWithoutNearId(): ', sql.findByParamsWithoutNearId.query, params);
      return rep.any(sql.findByParamsWithoutNearId, params);
    },
    findByParamsWithUnderNearId: (inputParams) => {
      let params = createNamedParameterObject(inputParams);
      logger.debug('sqlString for db.users.findByParamsWithNearId(): ', sql.findByParamsWithUnderNearId.query, params);
      return rep.any(sql.findByParamsWithUnderNearId, params);
    },
    findByParamsWithUpperNearId: (inputParams) => {
      let params = createNamedParameterObject(inputParams);
      logger.debug('sqlString for db.users.findByParamsWithNearId(): ', sql.findByParamsWithUpperNearId.query, params);
      return rep.any(sql.findByParamsWithUpperNearId, params);
    },
    all: () =>
      rep.any(`SELECT * FROM ${TABLE_NAME}`),
    total: () =>
      rep.one(`SELECT count(*) FROM ${TABLE_NAME}`, [], a => +a.count)
  };
};
