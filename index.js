'use strict';
const express = require('express');
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const expressJwt = require('express-jwt');
const UserAPI = require('./datasources/user');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { permissions } = require('./permissions');
const { createStore } = require('./pgAdaptor');

const PORT = 4000;
const path = '/api';
const app = express();

const store = createStore();

const dataSources = () => ({
  userAPI: new UserAPI({ store })
});

app.use(
  expressJwt({
    secret: process.env.BOILER_JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false
  })
);

const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs,
    resolvers
  }),
  permissions
);

const server = new ApolloServer({
  schema: schema,
  dataSources,
  context: ({ req }) => {
    const user = req.user ? req.user : null;
    return { user };
  }
});

server.applyMiddleware({ app, path });

app.listen({ port: PORT }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  )
);
