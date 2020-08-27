const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

const comparePassword = (hashPassword, password) => {
  return bcrypt.compareSync(password, hashPassword);
};

const resolvers = {
  Query: {
    users: async (_, __, { dataSources }) => {
      const users = await dataSources.userAPI.getUsers();

      return users;
    },
    user: async (_, { user_id }, { dataSources }) => {
      const user = await dataSources.userAPI.getUser({ user_id });
      return user;
    },
  },
  Mutation: {
    login: async (_, { email, password }, { dataSources, logger }) => {
      const user = await dataSources.userAPI.login({ email });
      if (!user || !comparePassword(user.password, password)) {
        logger.log({
          level: 'error',
          message: `Password compare failed user: ${user}`,
        });
        return JSON.stringify({ error: 'NOT_AUTHORIZED' });
      }

      delete user.password;

      return {
        ...user,
        token: jwt.sign(
          {
            'user-auth': { roles: user.roles, permissions: user.permissions },
          },
          process.env.GRAPHQL_CRUD_SERVER_JWT_SECRET,
          { algorithm: 'HS256', subject: String(user.user_id), expiresIn: '1d' }
        ),
      };
    },
    addUser: async (_, args, { dataSources }) => {
      args.password = hashPassword(args.password);
      const user = await dataSources.userAPI.addUser(args);
      return user;
    },
    removeUser: async (_, { user_id }, { dataSources }) => {
      const user = await dataSources.userAPI.removeUser({ user_id });
      return user;
    },
    updateUser: async (_, args, { dataSources }) => {
      const user = await dataSources.userAPI.updateUser(args);
      return user;
    },
  },
};

module.exports = resolvers;
