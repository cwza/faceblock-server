let configs = {
  app: {
    domain: 'http://localhost:3001',
    name: 'faceblock',
    privateKey: 'slakdjfalkdjsflkasdfjA123109238109',
    corsOrigins: ['http://localhost:3000', 'http://127.0.0.1:3000', undefined, 'https://cwza.github.io'],
  },
  db: {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres'
  },
  logger: {
    dir: './logs'
  }
}

module.exports = configs;
