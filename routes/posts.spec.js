const fetch = require('node-fetch');
const expect = require('chai').expect;
const db = require('../db').db;
const dbInit = require('../db/dbInit');

describe('route.posts', function() {
  let initUsers = null, initPosts = null;

  beforeEach(function() {
    return dbInit.initDatabase((initData) => {
      initUsers = initData.initUsers;
      initPosts = initData.initPosts;
    });
  });
  describe('GET /posts?userids=[1, 2]', function() {
    let url = 'http://localhost:3001/posts'
    it('get posts by userids(1) orderBy id asc page 2 limit 5', function() {
      let userids = [initUsers[0].id];
      return fetch(`${url}?userids=${JSON.stringify(userids)}&sort=id&order=asc&page=2`)
        .then((res) => {
          expect(res.status).to.equal(200);
          return res.json();
        }).then((json) => {
          let returnedPosts = json;
          let expectedPosts = initPosts.filter(post => userids.indexOf(post.userid) !== -1).slice(5, 10)
          expect(JSON.stringify(returnedPosts)).to.deep.equal(JSON.stringify(expectedPosts));
        });
    });
  });
  describe('GET /posts', function() {
    let url = 'http://localhost:3001/posts'
    it('get posts by params', function() {
      return fetch(`${url}?sort=id&order=asc`)
        .then((res) => {
          expect(res.status).to.equal(200);
          return res.json();
        }).then((json) => {
          let returnedPosts = json;
          expect(JSON.stringify(returnedPosts)).to.deep.equal(JSON.stringify(initPosts.slice(0, 5)));
        });
    });
  });
});
