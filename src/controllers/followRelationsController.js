const db = require('../db').db;
const utils = require('../utils');
const domain = require('../configs').app.domain;
const logger = require('../logger').logger;
const Constants = require('../Constants');
const followRelationsValidatorSchema = require('../validators/followRelationsValidatorSchema');
const controllerUtils = require('./controllerUtils');
const Errors = require('../Errors')

const checkAuthorization = (reqUser, followRelation) => {
  if(reqUser.id !== followRelation.followerId)
    throw Errors.authorizationError();
}

const checkRemoveAuthorization = (reqUser, followRelation) => {
  if(reqUser.id !== followRelation.userId && reqUser.id !== followRelation.followerId)
    throw Errors.authorizationError();
}

//if nextPage has no record nextPage will be the same to req
// else nextPage will be page + 1
const findByParamsWithoutNearId = (req, params) => {
  logger.info('findByParamsWithoutNearId()...');
  return db.task('findByParamsWithoutNearId', function *(t) {
    let nextPageFollowRelations = yield t.followRelations.findByParamsWithoutNearId(Object.assign({}, params, {page: params.page + 1}));
    let thisPageFollowRelations = yield t.followRelations.findByParamsWithoutNearId(params);
    let nextUrl = nextPageFollowRelations.length > 0 ? domain + utils.genNextPageUrl(req.originalUrl, params.page) : Constants.NO_NEXT_PAGE;
    let response = {
      entities: {
        followRelations: thisPageFollowRelations.map(element => utils.deletePropertiesFromObject(element, ['score']))
      },
      links: {
        nextPage: nextUrl
      }
    };
    logger.debug('response for followRelationsController.findByParamsWithoutNearId: ', JSON.stringify(response));
    return response;
  });
}

const findByParamsWithNearId = (req, params) => {
  logger.info('findByParamsWithNearId()...');
  return db.task(function *(t) {
    let followRelations = params.underNearId ? yield t.followRelations.findByParamsWithUnderNearId(params) : yield t.followRelations.findByParamsWithUpperNearId(params);
    let response = {
      entities: {
        followRelations: followRelations.map(element => utils.deletePropertiesFromObject(element, ['score']))
      },
    };
    logger.debug('response for followRelationsController.findByParamsWithNearId: ', JSON.stringify(response));
    return response;
  });
}


////////////////////////////////// map to routes ///////////////////////////////
const findByParams = (req) => {
  logger.info('findByParams()...');
  let params = controllerUtils.validate(req.query, followRelationsValidatorSchema.queryParamsSchema);
  if(params.upperNearId || params.underNearId) {
    return findByParamsWithNearId(req, params);
  } else {
    return findByParamsWithoutNearId(req, params);
  }
}

const addFollowRelation = (req) => {
  logger.info('addFollowRelation()...');
  let followRelation = controllerUtils.validate(req.body, followRelationsValidatorSchema.addFollowRelationSchema);
  checkAuthorization(req.user, followRelation);
  return db.followRelations.add(followRelation)
    .then(followRelation => {
      let response = {
        entities: {
          followRelations: [ followRelation ]
        }
      };
      logger.debug('response for addFollowRelation: ', response);
      return response;
    });
}

const removeFollowRelation = req => {
  logger.info('removeFollowRelation()...');
  let followRelationId = controllerUtils.validate(req.params, followRelationsValidatorSchema.idSchema).id;
  return db.tx('remove followRelation', function *(t) {
    let followRelation = yield t.followRelations.find(followRelationId);
    if(!followRelation) return;
    checkRemoveAuthorization(req.user, followRelation)
    return t.followRelations.remove(followRelationId);
  });
}

const findFollowRelation = req => {
  logger.info('findFollowRelation()...');
  let followRelationId = controllerUtils.validate(req.params, followRelationsValidatorSchema.idSchema).id;
  return db.followRelations.find(followRelationId)
    .then(followRelation => {
      if(!followRelation) throw Errors.objectNotFound();
      let response = {
        entities: {
          followRelations: [ followRelation ]
        }
      };
      logger.debug('response for findFollowRelation: ', response);
      return response;
    });
}

module.exports = {
  findByParams, findFollowRelation, addFollowRelation, removeFollowRelation
}
