let env = process.env.NODE_ENV || 'development';

let configs = {
  app: {
    domain: env === 'development' ? 'http://localhost:3001' : 'http://production'
  },
  db: {
    host: env === 'development' ? 'localhost' : process.env.DB_HOST,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: env === 'development' ? 'postgres' : process.env.DB_PWD
  },
  logger: {
    dir: '../logs'
  }
}

module.exports = configs;
