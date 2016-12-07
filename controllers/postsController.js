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

//if nextPage has no record nextPage will be the same to req
// else nextPage will be page + 1
let findByParams = (req) => {
  let params = queryParamsToParams(req.query);
  params.page = params.page || 1;

  let nextPagePromise = db.posts.findByParams(Object.assign({}, params, {page: params.page + 1}));
  let thisPagePromise = db.posts.findByParams(params);
  let promises = [nextPagePromise, thisPagePromise];
  return Promise.all(promises)
    .then( values => {
      let nextPageData = values[0];
      let thisPageData = values[1];
      let nextUrl = domain;
      if(nextPageData.length > 0)
        nextUrl += utils.genNextPageUrl(req.originalUrl, params.page);
      else
        nextUrl += req.originalUrl;
      return {
        entities: {
          posts: thisPageData.map(element => utils.deletePropertiesFromObject(element, ['score']))
        },
        links: {
          nextPage: nextUrl
        }
      }
    });

  // let nextUrl = domain + utils.genNextPageUrl(req.originalUrl, params.page);
  // return db.posts.findByParams(params)
  //   .then(data => {
  //     return {
  //       entities: {
  //         posts: data.map(element => utils.deletePropertiesFromObject(element, ['score']))
  //       },
  //       links: {
  //         nextPage: nextUrl
  //       }
  //     };
  //   });
}

module.exports = {
  findByParams
}
