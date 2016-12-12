const db = require('../db').db;
const utils = require('../utils');
const domain = require('../configs').app.domain;
const logger = require('../logger').logger;
const Constants = require('../Constants');

let queryParamsToParams = (queryParams) => {
  let params = Object.assign({}, db.posts.defaultQueryParams, queryParams);
  for(queryParam in queryParams) {
    switch (queryParam) {
      case 'maxId':
        break;
      default:
        params[queryParam] = queryParams[queryParam];
    }
  }
  params.page = params.page || 1;
  return params;
}

//if nextPage has no record nextPage will be the same to req
// else nextPage will be page + 1
let findByParams = (req) => {
  let params = queryParamsToParams(req.query);

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
    logger.debug('response for postsController.findByParams: ', JSON.stringify(response));
    return response;
  });
}

module.exports = {
  findByParams
}
