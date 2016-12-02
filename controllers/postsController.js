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

let findByParams = (req) => {
  let params = queryParamsToParams(req.query);
  return db.posts.findByParams(params)
    .then(data => {
      return data;
    })
}

module.exports = {
  findByParams
}
