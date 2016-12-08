const express = require('express');
const postsController = require('../controllers/postsController');
const logger = require('../logger').logger;
const postsSchemas = require('../validators/postsSchemas');
const validate = require('../validators/validator').validate;

const router = express.Router();

//domain/posts?q=userIds:(1, 2)&sort=id&order=asc&page=2
router.get('/', (req, res, next) => {
  logger.debug('req.query: ', req.query);
  // setTimeout(() => {
  //   validate(req, postsSchemas.findByParamsSchema)
  //     .then(() => postsController.findByParams(req))
  //     .then(data => res.status(200).json(data))
  //     .catch(error => next(error));
  // }, 3000)
  validate(req, postsSchemas.findByParamsSchema)
    .then(() => postsController.findByParams(req))
    .then(data => res.status(200).json(data))
    .catch(error => next(error));
});

module.exports = router;
