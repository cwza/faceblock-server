const db = require('../db').db;
const utils = require('../utils');
const domain = require('../configs').app.domain;
const logger = require('../logger').logger;
const Constants = require('../Constants');
const postsValidatorSchema = require('../validators/postsValidatorSchema');
const controllerUtils = require('./controllerUtils');
const Errors = require('../Errors')

let checkAuthorization = (reqUser, post) => {
  if(reqUser.id !== post.userId)
    throw Errors.authorizationError();
}

//if nextPage has no record nextPage will be the same to req
// else nextPage will be page + 1
let findByParamsWithoutNearId = (req, params) => {
  logger.info('findByParamsWithoutNearId()...');
  return db.task('findByParamsWithoutNearId', function *(t) {
    let nextPagePosts = yield t.posts.findByParamsWithoutNearId(Object.assign({}, params, {page: params.page + 1}));
    let thisPagePosts = yield t.posts.findByParamsWithoutNearId(params);
    nextUrl = nextPagePosts.length > 0 ? domain + utils.genNextPageUrl(req.originalUrl, params.page) : Constants.NO_NEXT_PAGE;
    let response = {
      entities: {
        posts: thisPagePosts.map(element => utils.deletePropertiesFromObject(element, ['score']))
      },
      links: {
        nextPage: nextUrl
      }
    };
    logger.debug('response for postsController.findByParamsWithoutNearId: ', JSON.stringify(response));
    return response;
  });
}

let findByParamsWithNearId = (req, params) => {
  logger.info('findByParamsWithNearId()...');
  return db.task(function *(t) {
    let posts = params.underNearId ? yield t.posts.findByParamsWithUnderNearId(params) : yield t.posts.findByParamsWithUpperNearId(params);
    let response = {
      entities: {
        posts: posts.map(element => utils.deletePropertiesFromObject(element, ['score']))
      },
    };
    logger.debug('response for postsController.findByParamsWithNearId: ', JSON.stringify(response));
    return response;
  });
}

////////////////////////////////// map to routes ///////////////////////////////
let findByParams = (req) => {
  logger.info('findByParams()...');
  let params = controllerUtils.validate(req.query, postsValidatorSchema.queryParamsSchema);
  if(params.upperNearId || params.underNearId) {
    return findByParamsWithNearId(req, params);
  } else {
    return findByParamsWithoutNearId(req, params);
  }
}

let addPost = (req) => {
  logger.info('addPost()...');
  let post = controllerUtils.validate(req.body, postsValidatorSchema.addPostSchema);
  checkAuthorization(req.user, post);
  return db.posts.add(post)
    .then(post => {
      let response = {
        entities: {
          posts: [ post ]
        }
      };
      logger.debug('response for addPost: ', response);
      return response;
    });
}

let removePost = req => {
  logger.info('removePost()...');
  let postId = controllerUtils.validate(req.params, postsValidatorSchema.idSchema).id;
  return db.tx('remove post', function *(t) {
    let post = yield t.posts.find(postId);
    if(!post) return;
    checkAuthorization(req.user, post)
    return t.posts.remove(postId);
  });
}

let findPost = req => {
  logger.info('findPost()...');
  let postId = controllerUtils.validate(req.params, postsValidatorSchema.idSchema).id;
  return db.posts.find(postId)
    .then(post => {
      if(!post) throw Errors.objectNotFound();
      let response = {
        entities: {
          posts: [ post ]
        }
      };
      logger.debug('response for findPost: ', response);
      return response;
    });
}

let updatePost = req => {
  logger.info('updatePost()...');
  let postId = controllerUtils.validate(req.params, postsValidatorSchema.idSchema).id;
  let postFromReq = controllerUtils.validate(req.body, postsValidatorSchema.updatePostSchema);
  return db.tx(function *(t) {
    let postFromDB = yield t.posts.find(postId);
    if(!postFromDB) throw Errors.objectNotFound();
    let post = utils.interMergeObject(postFromReq, postFromDB);
    checkAuthorization(req.user, post);
    post = yield t.posts.update(post);
    let response = {
      entities: {
        posts: [ post ]
      },
    };
    logger.debug('response for updatePost: ', response);
    return response;
  });
}

module.exports = {
  findByParams, addPost, removePost, findPost, updatePost
}
