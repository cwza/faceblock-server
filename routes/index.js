var express = require('express');
var router = express.Router();
const logger = require('../logger').logger
const authenticationController = require('../controllers/authenticationController');

// login
router.post('/login', (req, res, next) => {
  logger.debug('req.body: ', req.body);
  authenticationController.login(req)
    .then(data => res.status(200).json(data))
    .catch(error => next(error));
});

//authentication middleware exclude /login
//request header should contains valid faceblock_token to server
router.all('/*', function(req, res, next) {
  if(req.originalUrl === '/login')
    return next();
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
