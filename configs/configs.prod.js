//TODO: Add real domain and corsOrigins
let configs = {
  app: {
    domain: 'http://production',
    name: 'faceblock',
    privateKey: process.env.PRIVATE_KEY,
    corsOrigins: ['http://localhost:3000', 'http://127.0.0.1:3000'],
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
