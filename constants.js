const constants = {
  UNIQUE_VIOLATION: '23505',
  ADMIN: 'ADMIN',
  USER: 'USER',
  READ_OWN_ACCOUNT: `["read:own_account"]`,
  READ_ANY_ACCOUNT: `["read:any_account", "read:own_account"]`,
  NOT_AUTHORIZED: 'NOT_AUTHORIZED',
  REQUEST_ERROR: 'REQUEST_ERROR',
  BAD_AUTH: 'BAD_AUTH',
};

constants['USER_PERMISSIONS'] = `["${constants.READ_OWN_ACCOUNT}"]`;
constants[
  'ADMIN_PERMISSIONS'
] = `["${constants.READ_ANY_ACCOUNT}", "${constants.READ_OWN_ACCOUNT}"]`;

module.exports = constants;
