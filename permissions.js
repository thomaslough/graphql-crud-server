const { and, or, rule, shield } = require('graphql-shield');
const constants = require('./constants');

function getPermissions(user) {
  if (user && user['user-auth']) {
    return user['user-auth'].permissions;
  }
  return [];
}

const canEditFields = (args, user) => {
  const adminOnlyField = ['roles', 'enabled'];
  const canUpdate = true;
  adminOnlyField.map((item, index) => {
    for (let key in args) {
      if (
        key === adminOnlyField[index] &&
        user['user-auth'].roles !== `${constants.ADMIN}`
      ) {
        canUpdate = false;
      }
    }
    return item;
  });
  return canUpdate;
};

const isAuthenticated = rule()((parent, args, { user }) => {
  return user !== null;
});

const canReadAnyAccount = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);

  return userPermissions.includes(constants.READ_ANY_ACCOUNT);
});

const canReadOwnAccount = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return (
    userPermissions.includes(constants.READ_OWN_ACCOUNT) &&
    canEditFields(args, user)
  );
});

const isReadingOwnAccount = rule()((parent, args, { user }) => {
  return user && user.sub === args.user_id && canEditFields(args, user);
});

const permissions = shield({
  Query: {
    users: canReadAnyAccount,
    user: or(and(canReadOwnAccount, isReadingOwnAccount), canReadAnyAccount),
  },
  Mutation: {
    addUser: canReadAnyAccount,
    removeUser: canReadAnyAccount,
    updateUser: or(
      and(canReadOwnAccount, isReadingOwnAccount),
      canReadAnyAccount
    ),
  },
});

module.exports = { permissions };
