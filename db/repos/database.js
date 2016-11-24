'use strict';

var sql = require('../sql').database;

module.exports = (rep, pgp) => {
    return {
      dropAllTable: () =>
        rep.none(sql.dropAllTable),
      createAllTable: () =>
        rep.none(sql.createAllTable)
    };
};
