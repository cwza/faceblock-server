const express = require('express');
const followRelationsController = require('../controllers/followRelationsController');
const logger = require('../logger').logger;

const router = express.Router();

router.get('/:id', (req, res, next) => {
  logger.debug('req.params: ', req.params);
  followRelationsController.findFollowRelation(req)
    .then(data => res.status(200).json(data))
    .catch(error => next(error));
});

router.get('/', (req, res, next) => {
  logger.debug('req.query: ', req.query);
  followRelationsController.findByParams(req)
    .then(data => res.status(200).json(data))
    .catch(error => next(error));
});

router.post('/', (req, res, next) => {
  logger.debug('req.body: ', req.body);
  followRelationsController.addFollowRelation(req)
    .then(data => res.status(201).json(data))
    .catch(error => next(error));
});

router.delete('/:id', (req, res, next) => {
  logger.debug('req.params: ', req.params);
  followRelationsController.removeFollowRelation(req)
    .then(() => res.status(200).send())
    .catch(error => next(error));
});

module.exports = router;
