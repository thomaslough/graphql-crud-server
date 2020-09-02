require('@babel/register');

const { app, server } = require('..');
const PORT = 4000;

module.exports = async () => {
  if (!global.testingStarted) {
    global.testingStarted = true;
    await app.listen({ port: PORT }, () =>
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      )
    );
  }
};
