'use strict';

const squel = require("squel");
const sql = require('../sql').posts;
const Constants = require('../../Constants');
const logger = require('../../logger').logger;

module.exports = (rep, pgp) => {
  const TABLE_NAME = 'Posts';
  let defaultParams = {
    userIds: [],
    orderBy: Constants.ORDERBY.recent,
    count: Constants.COUNT
  };
  return {
    defaultParams,
    create: () =>
      rep.none(sql.create),
    add: post => {
      let sqlString = squel.insert().into(TABLE_NAME).setFieldsRows([post]).toString() + ' RETURNING *';
      return rep.one(sqlString, post => post);
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
    findByParams: (params = defaultParams) => {
      let sql = squel.select().from(TABLE_NAME);
      if(params.userIds.length > 0)
        sql = sql.where('userid IN ?', params.userIds).order(params.orderBy, false).order('id').toString();
      else
        sql = sql.order(params.orderBy, false).order('id').toString();
      logger.debug('sqlString for db.posts.findByParams(): ', sql.toString());
      return rep.any(sql.toString());
    },
    all: () =>
      rep.any(`SELECT * FROM ${TABLE_NAME}`),
    total: () =>
      rep.one(`SELECT count(*) FROM ${TABLE_NAME}`, [], a => +a.count)
  };
};
