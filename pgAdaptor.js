require('dotenv').config();
const pgPromise = require('pg-promise');
const pgp = pgPromise({});

const config = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.DB_NAME || rocess.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};

let dbName = null;

const createStore = () => {
  const db = pgp(config);

  const dbQuery = (query, values, logger, type = 'any') => {
    return db[type](query, values)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        logger.log({ level: 'error', message: JSON.stringify(err) });
        return err;
      });
  };

  return { db, dbQuery };
};

const getDB = () => {
  return dbName || false;
};

const setDB = (dbName) => {
  config.database = dbName;
};

module.exports = { createStore, getDB, setDB };
