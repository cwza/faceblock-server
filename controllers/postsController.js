const db = require('../db').db;
const utils = require('../utils');
const domain = require('../configs').app.domain;
const logger = require('../logger').logger;
const Constants = require('../Constants');
const postsValidatorSchema = require('../validators/postsValidatorSchema');

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
  logger.debug('findByParamsWithoutNearId()...');
  return db.task(function *() {
    let nextPagePosts = yield db.posts.findByParamsWithoutNearId(Object.assign({}, params, {page: params.page + 1}));
    let thisPagePosts = yield db.posts.findByParamsWithoutNearId(params);
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
  logger.debug('findByParamsWithNearId()...');
  return db.task(function *() {
    let posts = params.underNearId ? yield db.posts.findByParamsWithUnderNearId(params) : yield db.posts.findByParamsWithUpperNearId(params);
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
  let params = req.query;
  try {
    params = utils.validateObjectBySchema(params, postsValidatorSchema.queryParamsSchema);
  } catch(error) {
    error.status = 400, error.errorCode = 400;
    throw error;
  }
  if(params.upperNearId || params.underNearId) {
    return findByParamsWithNearId(req, params);
  } else {
    return findByParamsWithoutNearId(req, params);
  }
}

let addPost = (req) => {
  let body = req.body;
  try {
    post = utils.validateObjectBySchema(body, postsValidatorSchema.addPostSchema);
  } catch(error) {
    error.status = 400, error.errorCode = 400;
    throw error;
  }
  return db.posts.add(post)
    .then(post => {
      let response = {
        entities: {
          posts: [ post ]
        }
      };
      return response;
    });
}

module.exports = {
  findByParams, addPost
}
