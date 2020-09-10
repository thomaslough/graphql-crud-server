const express = require('express');
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway');
const expressJwt = require('express-jwt');
const PORT = 4000;
const apiPath = '/api';
const app = express();

const gateway = new ApolloGateway({
  serviceList: [{ name: 'users', url: 'http://localhost:5000/graphql' }],
  buildService({ name, url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        request.http.headers.set(
          'user',
          context.user ? JSON.stringify(context.user) : null
        );
        request.http.headers.set('db-name', 'graphql-crud');
      },
    });
  },
}); //.setRequestHeader("X-Hello", "World", false);

app.use(
  expressJwt({
    secret: 'some-secret',
    algorithms: ['HS256'],
    credentialsRequired: false,
  })
);

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  context: ({ req }) => {
    const user = req.user ? req.user : null;
    return { user };
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
