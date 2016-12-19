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
router.get('/', (req, res, next) => {
  logger.debug('req.query: ', req.query);
  // setTimeout(() => {
  // }, 3000)
  postsController.findByParams(req)
    .then(data => res.status(200).json(data))
    .catch(error => next(error));
});

router.post('/', (req, res, next) => {
  logger.debug('req.body: ', req.body);
  postsController.addPost(req)
    .then(data => res.status(201).json(data))
    .catch(error => next(error));
});
module.exports = router;
