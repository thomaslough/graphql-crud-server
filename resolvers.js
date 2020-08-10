const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const hashPassword = password => {
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
    user: async (_, { id }, { dataSources }) => {
      //return { first_name: 'booya' };
      const user = await dataSources.userAPI.getUser({ id });
      return user;
    }
  },
  Mutation: {
    login: async (_, { email, password }, { dataSources }) => {
      const user = await dataSources.userAPI.login({ email });
      if (!user || !comparePassword(user.password, password)) {
        return JSON.stringify({ error: 'NOT_AUTHORIZED' });
      }

      delete user.password;

      return {
        ...user,
        token: jwt.sign(
          {
            'user-auth': { roles: user.roles, permissions: user.permissions }
          },
          process.env.BOILER_JWT_SECRET,
          { algorithm: 'HS256', subject: String(user.id), expiresIn: '1d' }
        )
      };
    },
    addUser: async (_, args, { dataSources }) => {
      args.password = hashPassword(args.password);
      const user = await dataSources.userAPI.addUser(args);
      return user;
    },
    removeUser: async (_, { id }, { dataSources }) => {
      const user = await dataSources.userAPI.removeUser({ id });
      return user;
    },
    updateUser: async (_, args, { dataSources }) => {
      const user = await dataSources.userAPI.updateUser(args);
      return user;
    }
  }
};

module.exports = resolvers;
