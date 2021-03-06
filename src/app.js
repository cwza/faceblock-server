const express = require('express');
const path = require('path');
const morganLogger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet')
const queryParser = require('express-query-int');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');

const logger = require('./logger').logger;
const configs = require('./configs');
const Errors = require('./Errors');

const index = require('./routes/index');
const users = require('./routes/users');
const posts = require('./routes/posts');
const followRelations = require('./routes/followRelations');
const app = express();

//middleware
// app.use(postgraphql(configs.db, 'public', {graphiql: true}));
app.use(helmet());
app.use(morganLogger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(queryParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var corsOptions = {
  origin: function (origin, callback) {
    logger.debug('origin: ', origin);
    let originIsWhitelisted = configs.app.corsOrigins.indexOf(origin) !== -1
    callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted)
  }
}
app.options('/graphql', cors());
// graphql
app.use('/graphql', graphqlHTTP({
  schema: require('./graphQL/schemas/index'),
  // TODO should turn off at production
  graphiql: true
}));

app.use(cors(corsOptions));
//routers
app.use('/api', index);
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/followRelations', followRelations);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(Errors.pageNotFound());
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
    err = Errors.otherError(err);
  }
  let response = {error: err};
  logger.debug('error res: ', JSON.stringify(response, null, 2));
  res.json(response);
});

module.exports = app;
