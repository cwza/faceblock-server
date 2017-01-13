let env = process.env.NODE_ENV || 'development';

if(env === 'production') {
  module.exports = require('./configs.prod')
}
else if(env === 'docker') {
  module.exports = require('./configs.docker')
} else {
  module.exports = require('./configs.dev')
}
