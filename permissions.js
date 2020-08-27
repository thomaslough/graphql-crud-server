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

const isReadingOwnAccount = rule()((parent, { user_id }, { user }) => {
  return user && user.sub === user_id;
});

const permissions = shield({
  Query: {
    users: canReadAnyAccount,
    user: or(and(canReadOwnAccount, isReadingOwnAccount), canReadAnyAccount),
  },
  Mutation: {
    addUser: canReadAnyAccount,
    removeUser: canReadAnyAccount,
    updateUser: canReadAnyAccount,
  },
});

module.exports = { permissions };
