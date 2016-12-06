const dbInit = require('./dbInit');
const db = require('./').db;

describe.skip('db.dbInit', function() {
  describe.skip('#initDatabase()', function() {
    it('initDatabase', function() {
      return dbInit.initDatabase();
    });
  });
  describe.skip('#initTestData()', function() {
    it('initTestData', function() {
      return db.tx(function *(t) {
        yield* dbInit.initTestData();
      })
    });
  });
  describe.skip('#initUsersData()', function() {
    it('initUsersData', function() {
      return db.tx(function *(t) {
        yield* dbInit.initUsersData();
      });
    });
  });
});
