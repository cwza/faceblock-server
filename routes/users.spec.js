const fetch = require('node-fetch');
const expect = require('chai').expect;
const db = require('../db').db;
const dbInit = require('../db/dbInit');

describe.skip('route.users', function() {
  let initUsers = null, initPosts = null;

  beforeEach(function() {
    return dbInit.initDatabase((initData) => {
      initUsers = initData.initUsers;
      initPosts = initData.initPosts;
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
