'use strict';
const express = require('express');
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const expressJwt = require('express-jwt');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const UserAPI = require('./datasources/user');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { permissions } = require('./permissions');
const { createStore } = require('./pgAdaptor');
const logger = require('./logging');

const PORT = 4000;
const apiPath = '/api';
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
  makeExecutableSchema({
    typeDefs,
    resolvers,
  })
  //permissions
);

const server = new ApolloServer({
  schema: schema,
  dataSources,
  context: ({ req }) => {
    const user = req.user ? req.user : null;
    return { user, logger };
  },
});

server.applyMiddleware({ app, path: apiPath });

if (process.env.NODE_ENV !== 'test') {
  app.listen({ port: PORT }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    )
  );
}

module.exports = { app, server };
