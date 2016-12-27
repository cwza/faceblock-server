const express = require('express');
const postgraphql = require('postgraphql').postgraphql;
const path = require('path');
const favicon = require('serve-favicon');
const morganLogger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet')
const queryParser = require('express-query-int');

const logger = require('./logger').logger;
const Constants = require('./Constants');
const configs = require('./configs');

const index = require('./routes/index');
const users = require('./routes/users');
const posts = require('./routes/posts');
const app = express();

//middleware
app.use(postgraphql(configs.db, 'public', {graphiql: true}));
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
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
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
    errorCode: Constants.ERROR.PAGE_NOT_FOUND.code,
    message: Constants.ERROR.PAGE_NOT_FOUND.name,
    name: Constants.ERROR.PAGE_NOT_FOUND.name
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
  logger.error('err: ', err);
  if(err.status) {
    res.status(err.status);
  } else {
    res.status(500);
    err.status = 500, err.errorCode = Constants.ERROR.OTHER_ERROR.code, err.name = Constants.ERROR.OTHER_ERROR.name ;
    err.longMessage = JSON.stringify(err);
  }
  response = {
    error: {
      status: err.status, errorCode: err.errorCode, name: err.name, message: err.message, longMessage: err.longMessname
    }
  };
  logger.debug('error res: ', JSON.stringify(response, null, 2));
  res.json(response);
});

module.exports = app;
