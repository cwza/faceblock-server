const db = require('../').db;
const expect = require('chai').expect;
const dbInit = require('../dbInit');

describe('db.users', function() {
  let initUsers = null, initPosts = null;

  beforeEach(function() {
    return dbInit.initDatabase((initData) => {
      initUsers = initData.initUsers;
    });
  });
  describe('#remove() & find()', function() {
    it('remove Test User 1 and get null', function() {
      return db.tx(function *(t) {
        let deleteCount = yield db.users.remove(initUsers[0].id);
        expect(deleteCount).to.equal(1);
        let user = yield db.users.find(initUsers[0].id);
        expect(user).to.equal(null);
      });
    });
  });
  describe('#add() & get()', function() {
    it('add an user and then get it', function() {
      let userToBeAdd = {mail: 'Test user 3'};
      return db.tx(function *(t) {
        let userBeAdded = yield db.users.add(userToBeAdd);
        return userBeAdded;
      })
      .then((userBeAdded) => {
        expect(userBeAdded.mail).to.equal(userToBeAdd.mail);
      });
    });
  });
  describe('#all()', function() {
    it('get all users', function() {
      return db.users.all()
      .then((users) => {
        expect(users.slice(0).sort((a, b) => a.id - b.id)).to.deep.equal(initUsers);
      });
    });
  });
  describe('#total()', function() {
    it('calculate count', function() {
      return db.users.total()
      .then((total) => {
        expect(total).to.equal(initUsers.length);
      });
    });
  });
});
