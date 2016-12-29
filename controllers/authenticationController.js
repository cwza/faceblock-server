require('isomorphic-fetch');
const logger = require('../logger').logger;
const camelizeKeys = require('humps').camelizeKeys;
const jwt = require('jsonwebtoken');
const configs = require('../configs');
const db = require('../db').db;
const authenticationValidatorSchema = require('../validators/authenticationValidatorSchema');
const Errors = require('../Errors');
const controllerUtils = require('./controllerUtils');

const socialProvider = {
  google: 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json'
}
const expiresIn = '24h';

const getUserInfoFromSocial = (socialSite, socialToken) => {
  return fetch(socialProvider[socialSite] + '&access_token=' + socialToken)
    .then(response => {
      return response.json().then(json => ({json, response}));
    }).then(({json, response}) => {
      if(!response.ok) return Promise.reject(Object.assign({}, json.error, {errorFrom: socialSite}));
      return camelizeKeys(json);
    })
}

const createJwt = (user) => {
  return jwt.sign(user, configs.app.privateKey, {
        expiresIn: expiresIn,
        issuer: configs.app.name,
    });
}

// if user not found, create it. and return user and generated jwt
const checkUser = (userInfo) => {
  logger.debug('userInfo: ', userInfo);
  let mail = userInfo.email;
  return db.tx('authenticationController.checkUser', function* (t) {
    let user = yield t.users.findByMail(mail);
    if(!user) {
      user = yield t.users.add({mail: mail});
    }
    return {user, faceblockToken: createJwt(user)};
  });
}

const login = (req) => {
  logger.info('login()...');
  let params = controllerUtils.validate(req.body, authenticationValidatorSchema.loginSchema);
  return getUserInfoFromSocial(params.socialSite, params.socialToken)
    .then(userInfo => {
      if(!userInfo || !userInfo.email) throw Errors.authenticationError();
      return checkUser(userInfo);
    }).then(userWithJwt => {
      let response = {
        entities: {
          users: [userWithJwt.user]
        },
        authentication: {
          userId: userWithJwt.user.id,
          faceblockToken: userWithJwt.faceblockToken,
        }
      }
      logger.debug('response for login: ', JSON.stringify(response));
      return response;
    }).catch(error => {
      if(error.errorFrom) throw Errors.authenticationError(error);
    })
}

module.exports = {
  login
}

module.exports.private = {
  getUserInfoFromSocial, createJwt, checkUser, login
}
