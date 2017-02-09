const path = require('path');

let configs = {
  app: {
    domain: 'http://cwzc.pw',
    name: 'faceblock',
    privateKey: process.env.PRIVATE_KEY,
    corsOrigins: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://cwza.github.io'],
  },
  db: {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: process.env.DB_PWD
  },
  logger: {
    dir: path.resolve(__dirname, '../../../logs'),
  }
}

module.exports = configs;
