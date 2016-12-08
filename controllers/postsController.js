const db = require('../db').db;
const utils = require('../utils');
const domain = require('../configs').app.domain;
const logger = require('../logger').logger;

let queryParamsToParams = (queryParams) => {
  let params = {};
  for(queryParam in queryParams) {
    switch (queryParam) {
      case 'userIds':
        params[queryParam] = JSON.parse(queryParams.userIds);
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
    let nextPagePosts = yield db.posts.findByParams(Object.assign({}, params, {page: params.page + 1}));
    let thisPagePosts = yield db.posts.findByParams(params);
    let nextUrl = domain;
    nextUrl += nextPagePosts.length > 0 ? utils.genNextPageUrl(req.originalUrl, params.page) : req.originalUrl;
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
