//TODO: Add real domain and corsOrigins
let configs = {
  app: {
    domain: 'http://45.55.239.235',
    name: 'faceblock',
    privateKey: process.env.PRIVATE_KEY,
    corsOrigins: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://cwza.github.io'],
  },
  db: {
    host: 'docker_zombodb_postgres_1',
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
