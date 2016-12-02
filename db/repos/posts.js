'use strict';

const squel = require("squel");
const sql = require('../sql').posts;
const PARAMS = require('../../Constants').PARAMS;
const utils = require('../../utils');
const logger = require('../../logger').logger;

module.exports = (rep, pgp) => {
  const TABLE_NAME = 'Posts';
  let defaultQueryParams = {
    userids: [],
    sort: PARAMS.SORT.CREATE_TIME,
    order: PARAMS.ORDER.DESC,
    limit: 5,
    page: 1,
    offset: function() { return this.limit * (this.page - 1); }
  };
  return {
    defaultQueryParams,
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
    findByParams: (inputParams = defaultQueryParams) => {
      let params = utils.interMergeObject(inputParams, defaultQueryParams);
      let sql = squel.select().from(TABLE_NAME);
      if(params.userids.length > 0)
        sql = sql.where('userid IN ?', params.userids).order(params.sort, params.order === 'asc').limit(params.limit).offset(params.offset());
      else
        sql = sql.order(params.sort, params.order === 'asc').limit(params.limit).offset(params.offset());
      logger.debug('sqlString for db.posts.findByParams(): ', sql.toString());
      return rep.any(sql.toString());
    },
    all: () =>
      rep.any(`SELECT * FROM ${TABLE_NAME}`),
    total: () =>
      rep.one(`SELECT count(*) FROM ${TABLE_NAME}`, [], a => +a.count)
  };
};
