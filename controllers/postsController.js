const db = require('../db').db;

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

let findByParams = (queryParams) => {
  let params = queryParamsToParams(queryParams);
  return db.posts.findByParams(params)
    .then(data => {
      return data;
    })
}

module.exports = {
  findByParams
}
