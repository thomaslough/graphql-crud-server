require('dotenv').config();
const pgPromise = require('pg-promise');
const pgp = pgPromise({});
const mockDB = require('./mockDB');

mockDB.add(
  "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = 'admin@email.com' RETURNING *",
  [
    {
      creator_id: '1',
      enabled: true,
      user_id: '1',
      first_name: 'Jane',
      last_name: 'Doe',
      password: '$2b$08$lHBqnA02wwnfSRySTo5K5.GLTFBmJTMHn3TP0FYvrLzMJBVLhGTmO',
      email: 'admin@email.com',
      roles: '["ADMIN"]',
      permissions: '["read:any_account", "read:own_account"]',
      created: '1598486870577',
      last_login: '1598573007553',
    },
  ]
);

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
