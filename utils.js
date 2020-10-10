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

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

const getRandomCode = (count = 8) => {
  const chars = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    'A',
    'B',
    'C',
    'D',
    'E',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  let code = '';

  for (let i = 0; i < count; i++) {
    code += chars[getRandomInt(0, chars.length - 1)];
  }

  return code;
};

module.exports = {
  validateValue,
  formatRoles,
  formatPermissions,
  isEmail,
  getRandomInt,
  getRandomCode,
};
