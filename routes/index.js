var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let links = {
    users_url: req.get('host') + '/users',
  }
  res.json(links);
});

module.exports = router;
