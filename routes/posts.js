const express = require('express');
const postsController = require('../controllers/postsController');
const logger = require('../logger').logger;

const router = express.Router();

//req: domain/posts?q=userIds:(1, 2)&sort=createTime&order=desc&limit=5&underNearId=18
// res: {
//   entities:{
//     posts:[]
//   }
// }
router.get('/:id/comments/count', (req, res, next) => {
  logger.debug('req.params: ', req.params);
  postsController.getCommentsCount(req)
    .then(data => res.status(200).json(data))
    .catch(error => next(error));
});

router.get('/:id', (req, res, next) => {
  logger.debug('req.params: ', req.params);
  postsController.findPost(req)
    .then(data => res.status(200).json(data))
    .catch(error => next(error));
});

router.get('/', (req, res, next) => {
  logger.debug('req.query: ', req.query);
  // setTimeout(() => {
  postsController.findByParams(req)
    .then(data => res.status(200).json(data))
    .catch(error => next(error));
  // }, 10000)
});

router.post('/', (req, res, next) => {
  logger.debug('req.body: ', req.body);
  postsController.addPost(req)
    .then(data => res.status(201).json(data))
    .catch(error => next(error));
});

router.delete('/:id', (req, res, next) => {
  logger.debug('req.params: ', req.params);
  postsController.removePost(req)
    .then(() => res.status(200).send())
    .catch(error => next(error));
});

router.put('/:id', (req, res, next) => {
  logger.debug('req.params: ', req.params);
  logger.debug('req.body: ', req.body);
  postsController.updatePost(req)
    .then(data => res.status(200).json(data))
    .catch(error => next(error));
});
module.exports = router;
