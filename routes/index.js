var express = require('express');
var router = express.Router();
const authenticationController = require('../controllers/authenticationController');

//authentication
//request header should contains valid faceblock_token to server
router.all('/*', function(req, res, next) {
  authenticationController.authenticate(req)
    .then(user => {
      req.user = user;
      next();
    }).catch(error => next(error))
});

/* GET home page. */
router.get('/', function(req, res, next) {
  let links = {
    users_url: req.get('host') + '/users',
  }
  res.json(links);
});

module.exports = router;
