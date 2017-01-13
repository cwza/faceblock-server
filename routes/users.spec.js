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

describe('route.users', function() {
  let initUsers = null, initPosts = null, baseHeader = null;
  const pathRoot = '/api';

  beforeEach(function() {
    return dbInit.initDatabase((initData) => {
      initUsers = initData.initUsers;
      initPosts = initData.initPosts;
      baseHeader = {
        'faceblock_token': createJwt(initUsers[0]),
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000',
      };
    });
  });
  describe('GET /users?q=mail:(*gmail.com)&sort=id&order=asc&page=2', function() {
    let path = pathRoot + '/users?q=mail:(*gmail.com)&sort=id&order=asc&page=2';
    it('should return the 6th to 10th user', function(done) {
      let expectedResponse = JSON.stringify({
        entities: {
          users: initUsers.slice(5, 10)
        },
        links: {
          nextPage: configs.app.domain + pathRoot + '/users?q=mail:(*gmail.com)&sort=id&order=asc&page=3'
        }
      });
      request(app)
        .get(path)
        .set(baseHeader)
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
  describe('GET /users?q=mail:(*gmail.com)&sort=id&order=desc&underNearId=10&limit=6', function() {
    let path = pathRoot + '/users?q=mail:(*gmail.com)&sort=id&order=desc&underNearId=10&limit=6';
    it('should return users which id from 4 to 9', function(done) {
      let expectedResponse = JSON.stringify({
        entities: {
          users: initUsers.slice(0).sort((a, b) => b.id - a.id).filter(user => user.id >= 4 && user.id < 10)
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
  describe('GET /users?q=mail:(*gmail.com)&sort=id&order=desc&upperNearId=10&limit=6', function() {
    let path = pathRoot + '/users?q=mail:(*gmail.com)&sort=id&order=desc&upperNearId=10&limit=6';
    it('should return users which id from 11 to 16', function(done) {
      let expectedResponse = JSON.stringify({
        entities: {
          users: initUsers.slice(0).sort((a, b) => b.id - a.id).filter(user => user.id > 10 && user.id <= 16)
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
  describe('GET users/1', function() {
    let path = pathRoot + '/users/1';
    it('should returned id:1 user', function(done) {
      let expectedResponse = JSON.stringify({
        entities: {
          users: initUsers.filter(user => user.id === 1)
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
  describe('GET users/99999', function() {
    let path = pathRoot + '/users/99999';
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
