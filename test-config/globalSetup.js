require('@babel/register');

const { app, server } = require('..');
const PORT = 4000;
const apiPath = '/api';

module.exports = async () => {
  if (!global.testingStarted) {
    global.testingStarted = true;
    server.applyMiddleware({ app, path: apiPath });

    await app.listen({ port: PORT }, () =>
      console.log(`🚀 Server ready at http://localhost:${PORT}`)
    );
  }
};
