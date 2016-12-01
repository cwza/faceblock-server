const express = require('express');
const postsController = require('../controllers/postsController');
const logger = require('../logger').logger;
const postsSchemas = require('../validators/postsSchemas');

const router = express.Router();

//domain/posts?userids=[1, 2]&sort=id&order=asc&page=2
router.get('/', (req, res, next) => {
  logger.debug('req.query: ', req.query);
  req.checkParams(postsSchemas.findByParamsSchema);
  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      let error = {
        status: 400,
        message: 'Params Validation Error',
        longMessage: result.array()
      }
      next(error);
      return;
    }
    postsController.findByParams(req.query)
      .then(data => {
        res.status(200).json(data);
      }).catch(error => {
        next(error);
      });
  });
});

module.exports = router;
