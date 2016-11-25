let fetch = require('node-fetch');
let expect = require('chai').expect;
let db = require('../db').db;

describe('route.users', function() {
  let initUsers = null;

  function *initTable() {
    yield db.database.dropAllTable();
    yield db.database.createAllTable();
  }
  function *initData() {
    initUsers = [{mail: 'Test user 1'}, {mail: 'Test user 2'}];
    yield* initUsers.map((user, i) => {
      return db.users.add(user)
      .then((returnedUser) => {
        initUsers[i] = returnedUser;
      });
    });
  }
  beforeEach(function() {
    return db.tx(function *(t) {
      yield* initTable();
      yield* initData();
    });
  });
  describe('GET /users/id', function() {
    let url = 'http://localhost:3001/users/';
    it('get Test user 1', function() {
      return fetch(url + initUsers[0].id)
      .then((res) => {
        expect(res.status).to.equal(200);
        return res.json();
      }).then((json) => {
        expect(json.mail).to.equal(initUsers[0].mail);
      });
    });
    it('get user not found', function() {
      return fetch(url + '2000')
        .then((res) => {
          expect(res.status).to.equal(404);
        });
    });
  });
});
