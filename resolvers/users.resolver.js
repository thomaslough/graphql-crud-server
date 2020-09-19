const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Isemail = require('isemail');
const utils = require('../utils');
const constants = require('../constants');

const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

const comparePassword = (hashPassword, password) => {
  return bcrypt.compareSync(password, hashPassword);
};

const users = {
  Query: {
    users: async (_, __, { dataSources }) => {
      const users = await dataSources.userAPI.getUsers();

      return users;
    },
    user: async (_, { user_id }, { dataSources }) => {
      const res = await dataSources.userAPI.getUser({ user_id });
      return res[0] ? res[0] : null;
    },
  },
  Mutation: {
    login: async (_, { email, password }, { dataSources, logger }) => {
      const res = await dataSources.userAPI.login({ email });
      const user = res[0] ? res[0] : null;
      if (!user || !comparePassword(user.password, password)) {
        logger.log({
          level: 'error',
          message: `Password compare failed user: ${user}`,
        });
        return JSON.stringify({ error: constants.NOT_AUTHORIZED });
      }

      const responseUser = { ...user };
      delete responseUser.password;

      return {
        ...responseUser,
        token: jwt.sign(
          {
            'user-auth': {
              roles: responseUser.roles,
              permissions: responseUser.permissions,
            },
          },
          process.env.GRAPHQL_CRUD_SERVER_JWT_SECRET,
          {
            algorithm: 'HS256',
            subject: String(responseUser.user_id),
            expiresIn: '1d',
          }
        ),
      };
    },
    addUser: async (_, args, { dataSources, logger }) => {
      if (!Isemail.validate(args.email)) {
        logger.log({
          level: 'error',
          message: `Bad email format: ${args.email}`,
        });
        return JSON.stringify({ error: constants.REQUEST_ERROR });
      }

      args.password = hashPassword(args.password);
      const user = await dataSources.userAPI.addUser(args);
      return user;
    },
    removeUser: async (_, { user_id }, { dataSources }) => {
      const user = await dataSources.userAPI.removeUser({ user_id });
      return user;
    },
    updateUser: async (_, args, { dataSources, logger }) => {
      if (args.roles && !utils.validateValue(args.roles)) {
        logger.log({
          level: 'error',
          message: `wrong roles value format: ${args.roles}`,
        });
        return JSON.stringify({ error: constants.REQUEST_ERROR });
      }
      const user = await dataSources.userAPI.updateUser(args);
      return user;
    },
  },
};

module.exports = users;
