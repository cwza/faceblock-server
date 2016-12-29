const express = require('express');
const router = express.Router();
const logger = require('../logger').logger;
const authenticationController = require('../controllers/authenticationController');

router.post('/login', (req, res, next) => {
  logger.debug('req.body: ', req.body);
  authenticationController.login(req)
    .then(data => res.status(200).json(data))
    .catch(error => next(error));
});

router.post('/logout', (req, res, next) => {
  logger.debug('req', req);
});

module.exports = router;
