const db = require('../db').db;
const utils = require('../utils');
const domain = require('../configs').app.domain;
const logger = require('../logger').logger;
const Constants = require('../Constants');
const postsValidatorSchema = require('../validators/postsValidatorSchema');
const controller = require('./controller');

// let queryParamsToParams = (queryParams) => {
//   let params = {};
//   for(queryParam in queryParams) {
//     switch (queryParam) {
//       case 'upperNearId':
//         params['upperNearId'] = queryParams['upperNearId'];
//         break;
//       default:
//         params[queryParam] = queryParams[queryParam];
//     }
//   }
//   params.page = params.page || 1;
//   return params;
// }

//if nextPage has no record nextPage will be the same to req
// else nextPage will be page + 1
let findByParamsWithoutNearId = (req, params) => {
  logger.info('findByParamsWithoutNearId()...');
  return db.task(function *(t) {
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

let findByParams = (req) => {
  logger.info('findByParams()...');
  let params = controller.validate(req.query, postsValidatorSchema.queryParamsSchema);
  if(params.upperNearId || params.underNearId) {
    return findByParamsWithNearId(req, params);
  } else {
    return findByParamsWithoutNearId(req, params);
  }
}

let addPost = (req) => {
  logger.info('addPost()...');
  let post = controller.validate(req.body, postsValidatorSchema.addPostSchema);
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
  let postId = controller.validate(req.params, postsValidatorSchema.idSchema).id;
  return db.posts.remove(postId);
}

let findPost = req => {
  logger.info('findPost()...');
  let postId = controller.validate(req.params, postsValidatorSchema.idSchema).id;
  return db.posts.find(postId)
    .then(post => {
      if(!post) throw {status: 404, errorCode: Constants.ERROR.OBJECT_NOT_FOUND.code, name: Constants.ERROR.OBJECT_NOT_FOUND.name, message: Constants.ERROR.OBJECT_NOT_FOUND.name}
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
  let postId = controller.validate(req.params, postsValidatorSchema.idSchema).id;
  let postFromReq = controller.validate(req.body, postsValidatorSchema.updatePostSchema);
  return db.tx(function *(t) {
    let postFromDB = yield t.posts.find(postId);
    if(!postFromDB) throw {status: 404, errorCode: Constants.ERROR.OBJECT_NOT_FOUND.code, name: Constants.ERROR.OBJECT_NOT_FOUND.name, message: Constants.ERROR.OBJECT_NOT_FOUND.name}
    let post = utils.interMergeObject(postFromReq, postFromDB);
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
