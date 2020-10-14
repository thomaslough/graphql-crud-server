'use strict';
const express = require('express');
const {
  ApolloServer,
  makeExecutableSchema,
  AuthenticationError,
} = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const expressJwt = require('express-jwt');
const { buildFederatedSchema } = require('@apollo/federation');
const morgan = require('morgan');
const UserAPI = require('./datasources/Users');
const typeDefs = require('./typedefs');
const resolvers = require('./resolvers');
const { permissions } = require('./permissions');
const { createStore, getDB, setDB } = require('./pgAdaptor');
const logger = require('./logging');
const constants = require('./constants');

const PORT = 4000;
const path = '/api';
const app = express();

const store = createStore();

// setup the winston stream
app.use(morgan('combined', { stream: logger.stream }));

app.use(function (err, req, res, next) {
  // error level logging
  logger.error(logger.combinedFormat(err, req, res));
  res.status(err.status || 500).send('Internal server error.');
  next();
});

const dataSources = () => ({
  userAPI: new UserAPI({ store, logger }),
});

app.use(
  expressJwt({
    secret: process.env.GRAPHQL_CRUD_SERVER_JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false,
  })
);

const schema = applyMiddleware(
  buildFederatedSchema([{ typeDefs: typeDefs[0], resolvers: resolvers[0] }]),
  permissions
);

const server = new ApolloServer({
  schema,
  dataSources,
  context: ({ req }) => {
    let user = null;
    let dbName = process.env.POSTGRES_DB;

    if (req.headers.user) {
      user = JSON.parse(req.headers.user);
    } else if (req.user) {
      user = req.user;
    }

    if (req.headers['db-name']) {
      dbName = req.headers['db-name'];
    }

    if (!getDB()) {
      setDB(dbName);
    }

    return { user, logger };
  },
  formatError(err) {
    
    if (err.message && err.message.startsWith('Not Authorised!')) {
      const erroRes = {
        __typename: 'UnauthorizedError',
        message: constants.NOT_AUTHORIZED,
      };
      return erroRes;
    }
    console.log(err);
  },
});

server.applyMiddleware({ app, path, path });

if (process.env.NODE_ENV !== 'test') {
  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}${path}`)
  );
}

module.exports = { app, server };
