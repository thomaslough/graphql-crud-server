require('dotenv').config();
const pgPromise = require('pg-promise');
const pgp = pgPromise({});
const mockDB = require('./mockDB');

const config = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};

module.exports.createStore = () => {
  const db = pgp(config);

  const dbQuery = (query, values, logger, type = 'any') => {
    if (process.env.NODE_ENV === 'test') {
      return mockDB.result(query, values);
    } else {
      return db[type](query, values)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          logger.log({ level: 'error', message: JSON.stringify(err) });
          return err;
        });
    }
  };

  return { db, dbQuery };
};
