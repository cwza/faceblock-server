let configs = {
  app: {
    domain: 'http://localhost:3001',
    name: 'faceblock',
    privateKey: 'slakdjfalkdjsflkasdfjA123109238109',
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
