const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morganLogger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet')
const queryParser = require('express-query-int');

const logger = require('./logger').logger;

const index = require('./routes/index');
const users = require('./routes/users');
const posts = require('./routes/posts');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//middleware
app.use(helmet());
app.use(morganLogger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(queryParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// for CORS TODO: now allow all domain should add specific domain for production
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//routers
app.use('/', index);
app.use('/users', users);
app.use('/posts', posts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = {
    status: 404,
    errorCode: Constants.ERROR.PAGE_NOT_FOUND,
    message: 'PAGE_NOT_FOUND',
    name: 'PAGE_NOT_FOUND'
  }
  next(err);
});

// response = {
//   entities:{posts:[]},
//   link:{nextPage: ''}
// }
// error handler
// error = {
//   status,     //standard http status
//   errorCode,  //custom error code
//   name,       //custom error name
//   message,    //custom error name or error message from other library
//   longMessage //optional
// }
app.use(function(err, req, res, next) {
  logger.error(err);
  if(err.status) {
    res.status(err.status);
  } else {
    res.status(500);
    err.status = 500, err.errorCode = Constants.ERROR.OTHER_ERROR, err.name = 'OTHER_ERROR';
    err.longMessage = JSON.stringify(err);
  }
  response = {
    error: {
      status: err.status, errorCode: err.errorCode, name: err.name, message: err.message, longMessage: err.longMessage
    }
  };
  res.json(response);
});

module.exports = app;
