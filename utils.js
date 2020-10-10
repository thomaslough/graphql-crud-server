const constants = require('./constants');
const roleValues = {};

roleValues[constants.ADMIN] = constants.READ_ANY_ACCOUNT;
roleValues[constants.USER] = constants.READ_OWN_ACCOUNT;

const validateValue = (value) => {
  return roleValues[value] !== undefined;
};

const formatRoles = (roles) => {
  const rolesList = roles.split(',');
  return JSON.stringify(rolesList);
};

const formatPermissions = (roles) => {
  return roleValues[roles];
};

const isEmail = (email) => {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    email
  );
};

module.exports = { validateValue, formatRoles, formatPermissions, isEmail };
