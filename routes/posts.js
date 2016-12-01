const express = require('express');
const router = express.Router();
const db = require('../db').db;
const Constants = require('../Constants');

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
//domain/posts?userids=[1, 2]&sort=id&order=asc&page=2
router.get('/', (req, res, next) => {
  let params = queryParamsToParams(req.query);
  db.posts.findByParams(db.posts.genParams(params))
    .then((data) => {
      res.status(200).json(data);
    }).catch((error) => {
      let err = {};
      err.shortMessage = 'undefined error';
      err.longMessage = JSON.stringify(error);
      next(err);
    })
});

module.exports = router;
