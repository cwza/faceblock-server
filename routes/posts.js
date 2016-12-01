const express = require('express');
const postsController = require('../controllers/postsController');

const router = express.Router();

//domain/posts?userids=[1, 2]&sort=id&order=asc&page=2
router.get('/', (req, res, next) => {
  postsController.findByParams(req.query)
    .then(data => {
      res.status(200).json(data);
    }).catch(error => {
      next(error);
    });
});

module.exports = router;
