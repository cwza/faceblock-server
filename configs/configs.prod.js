let configs = {
  app: {
    domain: 'http://production',
    name: 'faceblock',
    privateKey: process.env.PRIVATE_KEY,
  },
  db: {
    host: process.env.DB_HOST,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: process.env.DB_PWD
  },
  logger: {
    dir: '../logs'
  }
}

module.exports = configs;
