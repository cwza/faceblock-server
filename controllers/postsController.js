const db = require('../db').db;
const utils = require('../utils');
const domain = require('../configs').app.domain;

let queryParamsToParams = (queryParams) => {
  let params = {};
  for(queryParam in queryParams) {
    switch (queryParam) {
      case 'userids':
        params[queryParam] = JSON.parse(queryParams.userids);
        break;
      default:
        params[queryParam] = queryParams[queryParam];
    }
  }
  return params;
}

let findByParams = (req) => {
  let params = queryParamsToParams(req.query);
  console.log('params.page: ', typeof(params.page));
  console.log('req.originalUrl: ', req.originalUrl);
  console.log('nextUrl: ', utils.genNextPageUrl(req.originalUrl, params.page));
  let nextUrl = domain + utils.genNextPageUrl(req.originalUrl, params.page !== undefined ? params.page : 1);
  return db.posts.findByParams(params)
    .then(data => {
      return {
        entities: {
          posts: data.map(element => utils.deletePropertiesFromObject(element, ['score']))
        },
        links: {
          nextPage: nextUrl
        }
      };
    });
}

module.exports = {
  findByParams
}
