const express = require('express');
const bcrypt = require('bcrypt');
const { createStore } = require('./pgAdaptor');
const constants = require('./constants');
const utils = require('./utils');

const store = createStore();
const app = express();

const port = 9000;
const now = Date.now();

const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

const dropUserTableQuery = `DROP TABLE IF EXISTS users`;
const createUserTableQuery = `CREATE TABLE IF NOT EXISTS users (
  user_id INT GENERATED ALWAYS AS IDENTITY, 
  email VARCHAR ( 255 ),
  first_name VARCHAR ( 255 ),
  last_name VARCHAR ( 255 ),
  password VARCHAR ( 255 ),
  roles VARCHAR ( 255 ),
  permissions VARCHAR ( 255 ),
  enabled BOOLEAN,
  creator_id VARCHAR ( 255 ),
  created TIMESTAMP,
  last_login TIMESTAMP,
  PRIMARY KEY(user_id)
  )`;
const populateUserTableQuery = `
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
    'admin@email.com',
    'Jane',
    'Doe',
    '${hashPassword(process.env.GRAPHQL_CRUD_SERVER_USER_PASSWORD)}',
    '${utils.formatRoles(constants.ADMIN)}',
    '${utils.formatPermissions(constants.ADMIN)}',
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
      'user@email.com',
      'John',
      'Doe',
      '${hashPassword(process.env.GRAPHQL_CRUD_SERVER_USER_PASSWORD)}',
      '${utils.formatRoles(constants.USER)}',
      '${utils.formatPermissions(constants.USER)}',
      to_timestamp(${now} / 1000.0),
      to_timestamp(${now} / 1000.0),
      true,
      '1'
    );
  `;

store.db
  .query(dropUserTableQuery, (values = ''))
  .then((res) => {
    console.log('dropped user table res', res);
    return store.db.query(createUserTableQuery, (values = ''));
  })
  .then((res) => {
    console.log('created user table res', res);
    return store.db.query(populateUserTableQuery, (values = ''));
  })
  .then((res) => {
    console.log('populated user table res', res);
    process.exit();
  })
  .catch((err) => {
    console.log('seed err', err);
    process.exit();
  });

app.listen(port, () => {
  console.log('🗂 http://localhost:' + port);
});
