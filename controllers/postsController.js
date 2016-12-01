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
  return db.posts.findByParams(db.posts.genParams(params))
    .then(data => {
      return data;
    }).catch(error => {
      let err = {
        message: error.message,
        longMessage: error
      }
      throw err;
    })
}

module.exports = {
  findByParams
}
