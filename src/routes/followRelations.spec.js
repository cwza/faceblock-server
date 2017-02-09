const request = require('supertest');
const app = require('../app');
const dbInit = require('../db/dbInit');
const expect = require('chai').expect;
const Errors = require('../Errors');
const createJwt = require('../controllers/authenticationController').private.createJwt;

describe('route.followRelations', function() {
  let initUsers = null, initPosts = null, initFollowRelations = null, baseHeader = {};
  const pathRoot = '/api';
  beforeEach(function() {
    return dbInit.initDatabase((initData) => {
      initUsers = initData.initUsers;
      initPosts = initData.initPosts;
      initFollowRelations = initData.initFollowRelations;
      baseHeader = {
        'faceblock-token': createJwt(initUsers[0]),
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000',
      };
    });
  });
  describe('GET /followRelations?q=userId:(20) and followerId:(1)&sort=id&order=desc&limit=5&page=1', function() {
    let path = pathRoot + '/followRelations?q=userId:(20) and followerId:(1)&sort=id&order=desc&limit=5&page=1';
    it('should return followRelation which userId=20, followerId=1', function(done) {
      let expectedResponse = JSON.stringify({
        entities: {
          followRelations: initFollowRelations.filter(initFollowRelation => initFollowRelation.userId === initUsers[19].id && initFollowRelation.followerId === 1)
        },
        links: {
          nextPage: 'NO_NEXT_PAGE'
        }
      });
      request(app)
        .get(path)
        .set(baseHeader)
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
  describe('GET /followRelations?q=userId:(20)&sort=id&order=desc&upperNearId=5&limit=3&page=1', function() {
    let path = pathRoot + `/followRelations?q=userId:(20)&sort=id&order=desc&upperNearId=5&limit=3&page=1`;
    it('should return followRelations which id from 21 to 26', function(done) {
      let expectedResponse = JSON.stringify({
        entities: {
          followRelations: initFollowRelations.slice(0).sort((a, b) => b.id - a.id).filter(initFollowRelation => initFollowRelation.followerId > 5 && initFollowRelation.followerId <= 8)
        },
      });
      request(app)
        .get(path)
        .set(baseHeader)
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
  describe('POST /followRelations {userId: 1, followerId: 12}', function() {
    let path = pathRoot + '/followRelations';
    it('should returned created post', function(done) {
      let body = {
        userId: initUsers[11].id,
        followerId: initUsers[0].id,
      }
      request(app)
        .post(path)
        .set(baseHeader)
        .send(body)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if(err) throw err;
          expect(res.body.entities.followRelations[0].userId).to.deep.equal(initUsers[11].id);
          done();
        });
    });
  });
  describe('DELETE followRelations/1', function() {
    let path = pathRoot + '/followRelations/1';
    it('should return 200', function(done) {
      request(app)
        .delete(path)
        .set(baseHeader)
        .set('Accept', 'application/json')
        .set('faceblock-token', createJwt(initUsers[0]))
        .expect(200, done);
    });
  });
  describe('GET followRelations/1', function() {
    let path = pathRoot + '/followRelations/1';
    it('should returned id:1 followRelation', function(done) {
      let expectedResponse = JSON.stringify({
        entities: {
          followRelations: initFollowRelations.filter(followRelation => followRelation.id === 1)
        },
      });
      request(app)
        .get(path)
        .set(baseHeader)
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
  describe('GET followRelations/99999', function() {
    let path = pathRoot + '/followRelations/99999';
    it('should return error OBJECT_NOT_FOUND', function(done) {
      let expectedResponse = JSON.stringify({
        error: Errors.objectNotFound()
      });
      request(app)
        .get(path)
        .set(baseHeader)
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
