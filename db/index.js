'use strict';

const promise = require('bluebird');

// Loading all the database repositories separately,
// because event 'extend' is called multiple times:
var repos = {
  users: require('./repos/users'),
  posts: require('./repos/posts'),
  database: require('./repos/database')
};

// pg-promise initialization options:
var options = {
  promiseLib: promise,
  // Extending the database protocol with our custom repositories:
  extend: obj => {
    // 1. Do not use 'require()' here, because this event occurs for every task
    //    and transaction being executed, which should be as fast as possible.
    // 2. We pass in `pgp` in case it is needed when implementing the repository;
    //    for example, to access namespaces `.as` or `.helpers`
    obj.users = repos.users(obj, pgp);
    obj.posts = repos.posts(obj, pgp);
    obj.database = repos.database(obj, pgp);
  }
};

let env = process.env.NODE_ENV || 'development';

// Database connection parameters:
var config = {
  host: env === 'development' ? 'localhost' : process.env.DB_HOST,
  port: 5432,
  database: 'faceblock',
  user: 'faceblock',
  password: env === 'development' ? 'faceblock' : process.env.DB_PWD
};

// Load and initialize pg-promise:
var pgp = require('pg-promise')(options);

// Create the database instance:
var db = pgp(config);

// Load and initialize all the diagnostics:
var diag = require('./diagnostics');
diag.init(options);

// If you ever need to change the default pool size, here's an example:
// pgp.pg.defaults.poolSize = 20;

module.exports = {
  // Library instance is often necessary to access all the useful
  // types and namespaces available within the library's root:
  pgp,
  // Database instance. Only one instance per database is needed
  // within any application.
  db
};
