let db = require('../').db;
let expect = require('chai').expect;

describe.skip('db.database', function() {
  describe.skip('#dropAllTable()', function() {
    it('dropAllTable', function() {
      return db.database.dropAllTable()
    });
  });
  describe.skip('#createAllTable()', function() {
    it('createAllTable', function() {
      return db.database.createAllTable();
    });
  });
});
