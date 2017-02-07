const express = require('express');
const usersController = require('../controllers/usersController');
const logger = require('../logger').logger;

const router = express.Router();

//req: domain/users?q=id:(1, 2)&sort=createTime&order=desc&limit=5&underNearId=18
// res: {
//   entities:{
//     users:[]
//   }
// }
router.get('/:id', (req, res, next) => {
  logger.debug('req.params: ', req.params);
  usersController.findUser(req)
    .then(data => res.status(200).json(data))
    .catch(error => next(error));
});

router.get('/', (req, res, next) => {
  logger.debug('req.query: ', req.query);
  // setTimeout(() => {
  // }, 3000)
  usersController.findByParams(req)
    .then(data => res.status(200).json(data))
    .catch(error => next(error));
});

module.exports = router;
