const constants = {
  UNIQUE_VIOLATION: '23505',
  ADMIN: 'ADMIN',
  USER: 'USER',
  READ_OWN_ACCOUNT: `["read:own_account"]`,
  READ_ANY_ACCOUNT: `["read:any_account", "read:own_account"]`,
  NOT_AUTHORIZED_ERROR: 'NOT_AUTHORIZED_ERROR',
  REQUEST_ERROR: 'REQUEST_ERROR',
  BAD_AUTH_ERROR: 'Wrong username or password',
  USER_EXISTS: 'USER_EXISTS',
};

constants['USER_PERMISSIONS'] = `["${constants.READ_OWN_ACCOUNT}"]`;
constants[
  'ADMIN_PERMISSIONS'
] = `["${constants.READ_ANY_ACCOUNT}", "${constants.READ_OWN_ACCOUNT}"]`;

module.exports = constants;
