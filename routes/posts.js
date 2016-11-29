var express = require('express');
var router = express.Router();
let db = require('../db').db;
let debug = require('debug')('faceblock:router/posts.js');
let Constants = require('../Constants');

let queryParamsToParams = (queryParams) => {
  let params = Object.assign({}, db.posts.defaultParams);
  for(queryParam in queryParams) {
    switch (queryParam) {
      case 'userIds':
        params[queryParam] = JSON.parse(queryParams.userIds);
        break;
      case 'orderBy':
        params[queryParam] = Constants.ORDERBY[queryParam];
        break;
      default:
        params[queryParam] = queryParams[queryParam];
    }
    return params;
  }
}
//domain/posts?users=["", "", ""]&count=20&orderBy=recent
router.get('/', (req, res, next) => {
  let params = queryParamsToParams(req.query);
  db.posts.findByParams(params)
    .then((data) => {
      res.status(200).json(data);
    }).catch((error) => {
      next(error);
    })
});

module.exports = router;
