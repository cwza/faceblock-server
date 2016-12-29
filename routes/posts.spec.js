const request = require('supertest');
const app = require('../app');
const db = require('../db').db;
const dbInit = require('../db/dbInit');
const configs = require('../configs');
const expect = require('chai').expect;
const Constants = require('../Constants');
const utils = require('../utils');
const Errors = require('../Errors');
const createJwt = require('../controllers/authenticationController').private.createJwt;

describe('route.posts', function() {
  let initUsers = null, initPosts = null;
  beforeEach(function() {
    return dbInit.initDatabase((initData) => {
      initUsers = initData.initUsers;
      initPosts = initData.initPosts;
    });
  });
  describe('GET /posts?q=userId:(1)&sort=id&order=asc&page=2', function() {
    let path = '/posts?q=userId:(1)&sort=id&order=asc&page=2';
    it('should return the 6th to 10th post which userId is 1', function(done) {
      let expectedResponse = JSON.stringify({
        entities: {
          posts: initPosts.filter(post => post.userId === 1).slice(5, 10)
        },
        links: {
          nextPage: configs.app.domain + '/posts?q=userId:(1)&sort=id&order=asc&page=3'
        }
      });
      request(app)
        .get(path)
        .set('Accept', 'application/json')
        .set('faceblock_token', createJwt(initUsers[0]))
        .expect('Content-Type', /json/)
        .expect(200, expectedResponse, (err, res) => {
          if(err) {
            console.log(res.body);
            console.log(err);
            throw err;
          }
          done();
        });
    });
  });
  describe('GET /posts?q=test&sort=id&order=desc&underNearId=20&limit=6', function() {
    let path = '/posts?q=test&sort=id&order=desc&underNearId=20&limit=6';
    it('should return posts which id from 14 to 19', function(done) {
      let expectedResponse = JSON.stringify({
        entities: {
          posts: initPosts.slice(0).sort((a, b) => b.id - a.id).filter(post => post.id >= 14 && post.id < 20)
        },
      });
      request(app)
        .get(path)
        .set('Accept', 'application/json')
        .set('faceblock_token', createJwt(initUsers[0]))
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
  describe('GET /posts?q=test&sort=id&order=desc&upperNearId=20&limit=6', function() {
    let path = '/posts?q=test&sort=id&order=desc&upperNearId=20&limit=6';
    it('should return posts which id from 21 to 26', function(done) {
      let expectedResponse = JSON.stringify({
        entities: {
          posts: initPosts.slice(0).sort((a, b) => b.id - a.id).filter(post => post.id > 20 && post.id <= 26)
        },
      });
      request(app)
        .get(path)
        .set('Accept', 'application/json')
        .set('faceblock_token', createJwt(initUsers[0]))
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
  describe('POST /posts {content: "xxx", userId: 1}', function() {
    let path = '/posts';
    it('should returned created post', function(done) {
      let body = {
        content: 'xxx',
        userId: 1
      }
      request(app)
        .post(path)
        .set('Accept', 'application/json')
        .set('faceblock_token', createJwt(initUsers[0]))
        .send(body)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if(err) throw err;
          expect(res.body.entities.posts[0].content).to.deep.equal('xxx');
          done();
        });
    });
  });
  describe('DELETE posts/1', function() {
    let path = '/posts/1';
    it('should returned created post', function(done) {
      request(app)
        .delete(path)
        .set('Accept', 'application/json')
        .set('faceblock_token', createJwt(initUsers[0]))
        .expect(200, done);
    });
  });
  describe('GET posts/1', function() {
    let path = '/posts/1';
    it('should returned id:1 post', function(done) {
      let expectedResponse = JSON.stringify({
        entities: {
          posts: initPosts.filter(post => post.id === 1)
        },
      });
      request(app)
        .get(path)
        .set('Accept', 'application/json')
        .set('faceblock_token', createJwt(initUsers[0]))
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
  describe('GET posts/99999', function() {
    let path = '/posts/99999';
    it('should return error OBJECT_NOT_FOUND', function(done) {
      let expectedResponse = JSON.stringify({
        error: Errors.objectNotFound()
      });
      request(app)
        .get(path)
        .set('Accept', 'application/json')
        .set('faceblock_token', createJwt(initUsers[0]))
        .expect('Content-Type', /json/)
        .expect(404, expectedResponse, (err, res) => {
          if(err) {
            console.log(res.body);
            throw err;
          }
          done();
        });
    });
  });
  describe('PUT posts/1', function() {
    let path = '/posts/1';
    it('should returned updated id:1 post', function(done) {
      let body = { content: 'xxx' };
      request(app)
        .put(path)
        .send(body)
        .set('Accept', 'application/json')
        .set('faceblock_token', createJwt(initUsers[0]))
        .expect('Content-Type', /json/)
        .expect(200, (err, res) => {
          if(err) {
            console.log(res.body);
            throw err;
          }
          expect(res.body.entities.posts[0].content).to.equal('xxx');
          expect(res.body.entities.posts[0].updateTime).to.not.equal(initPosts.filter(post => post.id === 1)[0].updateTime);
          done();
        });
    });
  });
  describe('PUT posts/9999', function() {
    let path = '/posts/9999';
    it('should return error OBJECT_NOT_FOUND', function(done) {
      let body = { content: 'xxx' };
      let expectedResponse = JSON.stringify({
        error: Errors.objectNotFound()
      });
      request(app)
        .put(path)
        .send(body)
        .set('Accept', 'application/json')
        .set('faceblock_token', createJwt(initUsers[0]))
        .expect('Content-Type', /json/)
        .expect(404, expectedResponse, (err, res) => {
          if(err) {
            console.log(res.body);
            throw err;
          }
          done();
        });
    });
  });
});
