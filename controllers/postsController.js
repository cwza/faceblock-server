const db = require('../db').db;
const utils = require('../utils');

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
  return db.posts.findByParams(params)
    .then(data => {
      return {data: data.map(element => utils.deletePropertiesFromObject(element, ['score']))};
    })
}

module.exports = {
  findByParams
}
