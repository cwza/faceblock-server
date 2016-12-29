const express = require('express');
const router = express.Router();

router.get('/login', (req, res, next) => {
  logger.debug('req.query: ', req.query);
});

router.get('/logout', (req, res, next) => {
  logger.debug('req', req);
});

module.exports = router;
