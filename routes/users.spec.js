let fetch = require('node-fetch');
let expect = require('chai').expect;
let db = require('../db').db;

describe('route.users', function() {
  let initUsers = [{mail: 'Test user 1'}, {mail: 'Test user 2'}];

  beforeEach(function() {
    initUsers = [{mail: 'Test user 1'}, {mail: 'Test user 2'}];
    return db.tx(function *(t) {
      yield db.database.dropAllTable();
      yield db.database.createAllTable();
      yield* initUsers.map((user, i) => {
        return db.users.add(user)
        .then((returnedUser) => {
          initUsers[i] = returnedUser;
        });
      });
    });
  });
  describe('GET /users/id', function() {
    let url = 'http://localhost:3000/users/';
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
