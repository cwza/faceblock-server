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
  describe('GET /posts?q=userid:(1)&sort=id&order=asc&page=2', function() {
    let path = '/posts?q=userid:(1)&sort=id&order=asc&page=2&something=sss';
    it('should return the 6th to 10th post which userid is 1', function(done) {
      let expectedResponse = JSON.stringify({
        entities: {
          posts: initPosts.filter(post => post.userid === 1).slice(5, 10)
        }
      });
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
