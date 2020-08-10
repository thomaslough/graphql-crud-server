const pgPromise = require('pg-promise');
const pgp = pgPromise({});
const dbName = 'boiler';

const config = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: dbName,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
};

module.exports.createStore = () => {
  const db = pgp(config);
  return { db };
};
