const express = require('express');
const router = express.Router();
const db = require('../db').db;
const debug = require('debug')('faceblock:router/users.js');

router.get('/:id', (req, res, next) => {
  db.users.find(req.params.id)
    .then((user) => {
      if(user === null) {
        res.status(404).end();
      } else {
        res.status(200).json(user);
      }
    })
    .catch((error) => {
      next(error);
    });
});

/* GET users listing. */
router.get('/', (req, res, next) => {
  db.users.all()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
