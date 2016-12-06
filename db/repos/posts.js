'use strict';

const squel = require("squel").useFlavour('postgres');
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
    offset: function() { return this.limit * (this.page - 1); }
  };
  return {
    defaultQueryParams,
    create: () =>
      rep.none(sql.create),
    add: post => {
      let sql = squel.insert().into(TABLE_NAME).setFieldsRows([post]).returning('*');
      return rep.one(sql.toString(), post => post);
    },
    addMulti: posts => {
      let sql = squel.insert().into(TABLE_NAME).setFieldsRows(posts).returning('*');
      return rep.any(sql.toString(), posts => posts);
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
      let sqlString = `SELECT zdb_score('${TABLE_NAME}', ${TABLE_NAME}.ctid) AS score, * FROM ${TABLE_NAME} WHERE zdb('${TABLE_NAME}', ctid) ==> '${params.q}' ORDER BY ${params.sort} ${params.order} LIMIT ${params.limit} OFFSET ${params.offset()}`;
      logger.debug('sqlString for db.posts.findByParams(): ', sqlString);
      return rep.any(sqlString);
    },
    all: () =>
      rep.any(`SELECT * FROM ${TABLE_NAME}`),
    total: () =>
      rep.one(`SELECT count(*) FROM ${TABLE_NAME}`, [], a => +a.count)
  };
};
