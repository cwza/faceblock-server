const db = require('../db').db;
const utils = require('../utils');
const domain = require('../configs').app.domain;
const logger = require('../logger').logger;
const Constants = require('../Constants');
const usersValidatorSchema = require('../validators/usersValidatorSchema');
const controllerUtils = require('./controllerUtils');
const Errors = require('../Errors')

let checkAuthorization = (reqUser, user) => {
  if(reqUser.id !== user.id)
    throw Errors.authorizationError();
}

//if nextPage has no record nextPage will be the same to req
// else nextPage will be page + 1
let findByParamsWithoutNearId = (req, params) => {
  logger.info('findByParamsWithoutNearId()...');
  return db.task('findByParamsWithoutNearId', function *(t) {
    let nextPageUsers = yield t.users.findByParamsWithoutNearId(Object.assign({}, params, {page: params.page + 1}));
    let thisPageUsers = yield t.users.findByParamsWithoutNearId(params);
    nextUrl = nextPageUsers.length > 0 ? domain + utils.genNextPageUrl(req.originalUrl, params.page) : Constants.NO_NEXT_PAGE;
    let response = {
      entities: {
        users: thisPageUsers.map(element => utils.deletePropertiesFromObject(element, ['score']))
      },
      links: {
        nextPage: nextUrl
      }
    };
    logger.debug('response for usersController.findByParamsWithoutNearId: ', JSON.stringify(response));
    return response;
  });
}

let findByParamsWithNearId = (req, params) => {
  logger.info('findByParamsWithNearId()...');
  return db.task(function *(t) {
    let users = params.underNearId ? yield t.users.findByParamsWithUnderNearId(params) : yield t.users.findByParamsWithUpperNearId(params);
    let response = {
      entities: {
        users: users.map(element => utils.deletePropertiesFromObject(element, ['score']))
      },
    };
    logger.debug('response for usersController.findByParamsWithNearId: ', JSON.stringify(response));
    return response;
  });
}

////////////////////////////////// map to routes ///////////////////////////////
let findByParams = (req) => {
  logger.info('findByParams()...');
  let params = controllerUtils.validate(req.query, usersValidatorSchema.queryParamsSchema);
  if(params.upperNearId || params.underNearId) {
    return findByParamsWithNearId(req, params);
  } else {
    return findByParamsWithoutNearId(req, params);
  }
}


let findUser = req => {
  logger.info('findPost()...');
  let userId = controllerUtils.validate(req.params, usersValidatorSchema.idSchema).id;
  return db.users.find(userId)
    .then(user => {
      if(!user) throw Errors.objectNotFound();
      let response = {
        entities: {
          users: [ user ]
        }
      };
      logger.debug('response for findUser: ', response);
      return response;
    });
}

module.exports = {
  findByParams, findUser
}
