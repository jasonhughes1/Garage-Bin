module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/garage',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },
  test: {
  client: 'pg',
  connection: process.env.DATABASE_URL || 'postgres://localhost/garagetest',
  useNullAsDefault: true,
  migrations: {
    directory: __dirname + '/db/migrations'
  },
  seeds: {
    directory: './db/seeds/test'
  }
},
production: {
  client: 'pg',
  connection: process.env.DATABASE_URL} + 'ssl=true',
  migrations: {
    directory: './db/migrations'
  },
  useNullAsDefault: true
},
};
