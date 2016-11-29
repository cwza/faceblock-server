let fetch = require('node-fetch');
let expect = require('chai').expect;
let db = require('../db').db;
let dbInit = require('../db/dbInit');

describe('route.posts', function() {
  let initUsers = null, initPosts = null;

  beforeEach(function() {
    return dbInit.initDatabase((initData) => {
      initUsers = initData.initUsers;
      initPosts = initData.initPosts;
    });
  });
  describe('GET /posts?userIds=[1, 2]', function() {
    let url = 'http://localhost:3001/posts'
    it('get posts by userIds(1, 2) orderBy recent', function() {
      let userIds = [initUsers[0].id, initUsers[1].id];
      return fetch(url + '?userIds=' + JSON.stringify(userIds))
        .then((res) => {
          expect(res.status).to.equal(200);
          return res.json();
        }).then((json) => {
          let returnedPosts = json.sort((a, b) => a.id - b.id);
          let expectedPosts = initPosts.filter((post) => post.userid === initUsers[0].id || initUsers[1].id);
          expect(JSON.stringify(returnedPosts)).to.deep.equal(JSON.stringify(expectedPosts));
        });
    });
  });
  describe('GET /posts', function() {
    let url = 'http://localhost:3001/posts'
    it('get posts by params', function() {
      return fetch(url)
        .then((res) => {
          expect(res.status).to.equal(200);
          return res.json();
        }).then((json) => {
          let returnedPosts = json.sort((a, b) => a.id - b.id);
          expect(JSON.stringify(returnedPosts)).to.deep.equal(JSON.stringify(initPosts));
        });
    });
  });
});
