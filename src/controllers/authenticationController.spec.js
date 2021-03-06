const authenticationController = require('./authenticationController').private;
const jwt = require('jsonwebtoken');
const configs = require('../configs');
const expect = require('chai').expect;
const dbInit = require('../db/dbInit');

describe('authenticationController', function() {
  const socialToken = 'ya29.CjDDA7ZgPbcaXyWWOqap6VBWUTKoGyLJ5_BojbbGvSK6DkgwUYqzVXH7nIMgZ3xRUtw';
  let initUsers = null, initPosts = null;

  beforeEach(function() {
    return dbInit.initDatabase((initData) => {
      initUsers = initData.initUsers;
      initPosts = initData.initPosts;
    });
  });

  describe.skip('#getUserInfoFromSocial()', function() {
    it('should return userInfo', function() {
      return authenticationController.getUserInfoFromSocial('google', socialToken)
        .then(response => {
          console.log('response: ', response);
        }).catch(error => {
          console.log('error: ', error);
        })
    });
  });
  describe.skip('#createJwt()', function() {
    it('should return decoded user', function() {
      let user = {id: 2, mail: 'xxxxxx'}
      let jwtStr = authenticationController.createJwt(user);
      let decoded = jwt.verify(jwtStr, configs.app.privateKey, {
          issuer: configs.app.name
        });
      console.log('decoded: ', decoded);
    });
  });
  describe('#checkUser()', function() {
    it('should return userWithJwt', function() {
      let userInfo = {email: initUsers[0].mail, picture: 'http://google.com/test.jpg'}
      return authenticationController.checkUser(userInfo)
        .then(userWithJwt=> {
          expect(userWithJwt.faceblockToken).to.not.equal(undefined);
          expect(userWithJwt.user.mail).to.equal(userInfo.email);
          expect(userWithJwt.user.picture).to.equal(userInfo.picture);
        })
    });
  });
  describe.skip('#login()', function() {
    it('', function() {
      let req = {
        body: {
          socialSite: 'google', socialToken
        }
      }
      return authenticationController.login(req)
        .then(response => {
          console.log('response: ', response);
        }).catch(error => {
          console.log('error: ', error);
        })
    });
  });
  describe('#authenticate()', function() {
    it('should return initUsers[0]', function() {
      let req = {
        headers: {
          "faceblock-token": authenticationController.createJwt(initUsers[0])
        }
      }
      return authenticationController.authenticate(req)
        .then(response => {
          expect(response).to.deep.equal(initUsers[0]);
        }).catch(error => {
          console.log('error: ', JSON.stringify(error));
        })
    });
  });
});
