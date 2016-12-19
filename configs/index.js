let env = process.env.NODE_ENV || 'development';

if(env === 'production')
  module.exports = require('./configs.prod')
else
  module.exports = require('./configs.dev')
