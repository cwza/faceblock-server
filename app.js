const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morganLogger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const logger = require('./logger').logger;

const index = require('./routes/index');
const users = require('./routes/users');
const posts = require('./routes/posts');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//middleware
app.use(morganLogger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator({
  customValidators: {
    isArray: function(param) {
      return Array.isArray(JSON.parse(param));
    },
    exactlyMatch: function(param, values) {
      return values.indexOf(param) !== -1;
    },
  }
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routers
app.use('/', index);
app.use('/users', users);
app.use('/posts', posts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = {
    status: 404,
    errorCode: 404,
    message: 'Not Found'
  }
  next(err);
});

// error handler
// error = {
//   status,
//   errorCode,
//   message,
//   longMessage
// }
app.use(function(err, req, res, next) {
  logger.error(err);
  res.status(err.status || 500);
  let error = err.errorCode ? {error: err} : {error: {status: 500, message: err.message, longMessage: err}}
  res.json(error);
});

module.exports = app;
