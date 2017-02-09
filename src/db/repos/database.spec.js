let db = require('../').db;
// let expect = require('chai').expect;

describe('db.database', function() {
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
  describe.skip('#truncateAllTable()', function() {
    it('truncateAllTable', function() {
      return db.database.truncateAllTable();
    });
  });
});
