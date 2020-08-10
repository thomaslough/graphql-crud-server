const express = require('express');
const bcrypt = require('bcrypt');
const { createStore } = require('./pgAdaptor');

const store = createStore();
const app = express();

const port = 5000;
const now = Date.now();

const hashPassword = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

const dropQuery = `DROP TABLE IF EXISTS users`;
const createTableQuery = `CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY, 
  email VARCHAR ( 255 ),
  first_name VARCHAR ( 255 ),
  last_name VARCHAR ( 255 ),
  password VARCHAR ( 255 ),
  roles VARCHAR ( 255 ),
  permissions VARCHAR ( 255 ),
  enabled BOOLEAN,
  creator_id VARCHAR ( 255 ),
  created TIMESTAMP,
  last_login TIMESTAMP
  )`;
const populateTableQuery = `
INSERT INTO users (
  email,
  first_name,
  last_name,
  password,
  roles,
  permissions,
  created,
  last_login,
  enabled,
  creator_id )
  VALUES (
    'admin@electricapple.com',
    'admin',
    'admin',
    '${hashPassword(process.env.BOILER_USER_PASSWORD)}',
    '["ADMIN"]',
    '["read:any_account", "read:own_account"]',
    to_timestamp(${now} / 1000.0),
    to_timestamp(${now} / 1000.0),
    true,
    '1'
  );
 INSERT INTO users (
    email,
    first_name,
    last_name,
    password,
    roles,
    permissions,
    created,
    last_login,
    enabled,
    creator_id )
    VALUES (
      'user@electricapple.com',
      'user',
      'user',
      '${hashPassword(process.env.BOILER_USER_PASSWORD)}',
      '["USER"]',
      '["read:own_account"]',
      to_timestamp(${now} / 1000.0),
      to_timestamp(${now} / 1000.0),
      true,
      '1'
    );
  `;

store.db
  .any(dropQuery, (values = ''))
  .then(res => {
    console.log('drop table res', res);
    return store.db.any(createTableQuery, (values = ''));
  })
  .then(res => {
    console.log('create table res', res);
    return store.db.any(populateTableQuery, (values = ''));
  })
  .then(res => {
    console.log('populate table res', res);
    process.exit();
  })
  .catch(err => {
    console.log('drop table err', err);
  });

/* store.db
  .any(populateTableQuery, (values = ''))
  .then((res) => {
    console.log('populate table res', res);
  })
  .catch((err) => {
    console.log('drop table err', err);
  }); */

app.listen(port, () => {
  console.log('🗂 http://localhost:' + port);
});
