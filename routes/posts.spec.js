const request = require('supertest');
const app = require('../app');
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
  describe('GET /posts?userids=[1]&sort=id&order=asc&page=2', function() {
    let path = '/posts?userids=[1]&sort=id&order=asc&page=2&something=sss';
    it('should return the 6th to 10th post which userid is 1', function(done) {
      let userids = [initUsers[0].id];
      let expectedResponse = JSON.stringify(initPosts.filter(post => userids.indexOf(post.userid) !== -1).slice(5, 10));
      request(app)
        .get(path)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, expectedResponse, (err, res) => {
          if(err) {
            console.log(res.body);
            throw err;
          }
          done();
        });
    });
  });
  describe('GET /posts', function() {
    let path = '/posts?sort=id&order=asc';
    it('should return the first 5 posts', function(done) {
      let expectedResponse = JSON.stringify(initPosts.slice(0, 5));
      request(app)
        .get(path)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, expectedResponse, (err, res) => {
          if(err) {
            console.log(res.body);
            throw err;
          }
          done();
        });
    });
  });
});
