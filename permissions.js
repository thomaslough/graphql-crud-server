const { and, or, rule, shield } = require('graphql-shield');

function getPermissions(user) {
  if (user && user['user-auth']) {
    return user['user-auth'].permissions;
  }
  return [];
}

const isAuthenticated = rule()((parent, args, { user }) => {
  return user !== null;
});

const canReadAnyAccount = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);

  return userPermissions.includes('read:any_account');
});

const canReadOwnAccount = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes('read:own_account');
});

const isReadingOwnAccount = rule()((parent, { id }, { user }) => {
  return user && user.sub === id;
});

const permissions = shield({
  Query: {
    users: canReadAnyAccount,
    user: and(canReadAnyAccount, or(canReadOwnAccount, isReadingOwnAccount)),
  },
  Mutation: {
    addUser: canReadAnyAccount,
    removeUser: canReadAnyAccount,
    updateUser: canReadAnyAccount,
  },
});

module.exports = { permissions };
