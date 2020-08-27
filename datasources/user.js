//const isEmail = require('isemail');
const { DataSource } = require('apollo-datasource');

class UserAPI extends DataSource {
  constructor({ store, logger }) {
    super();
    this.store = store;
    this.logger = logger;
  }

  async login({ email: emailArg } = {}) {
    const query = `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = '${emailArg}' RETURNING *`;
    const values = [];

    return this.store.db
      .any(query, values)
      .then((res) => {
        return res[0] ? res[0] : null;
      })
      .catch((err) => {
        logger.log({ level: 'error', message: JSON.stringify(err) });
        return err;
      });
  }
  async getUser({ user_id: idArg } = {}) {
    const query = `SELECT * FROM users WHERE user_id = '${idArg}'`;
    const values = [];

    return this.store.db
      .any(query, values)
      .then((res) => {
        return res[0] ? res[0] : null;
      })
      .catch((err) => {
        logger.log({ level: 'error', message: JSON.stringify(err) });
        return err;
      });
  }
  async getUsers() {
    const query = `SELECT * FROM users`;
    const values = [];

    return this.store.db
      .any(query, values)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        logger.log({ level: 'error', message: JSON.stringify(err) });
        return err;
      });
  }
  async addUser(args) {
    const query = `INSERT INTO users(
      email, 
      first_name, 
      last_name, 
      password, 
      roles,
      permissions,
      created, 
      last_login, 
      enabled, 
      creator_id)
      VALUES 
      ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $9, $10) RETURNING user_id`;

    const values = [
      args.email,
      args.first_name,
      args.last_name,
      args.password,
      args.roles,
      args.permissionvs,
      '',
      '',
      args.enabled,
      args.creator_id,
    ];

    return this.store.db
      .one(query, values)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        logger.log({ level: 'error', message: JSON.stringify(err) });
        err.message = err.code || 'none';
        return err;
      });
  }
  async removeUser({ user_id: idArg } = {}) {
    const query = `DELETE FROM users WHERE user_id = '${idArg}' RETURNING user_id`;
    const values = [idArg];

    return this.store.db
      .one(query, values)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        logger.log({ level: 'error', message: JSON.stringify(err) });
        err.message = err.code || 'none';
        return err;
      });
  }
  async updateUser(args) {
    let builtArgs = '';
    let commaCount = 0;
    for (let key in args) {
      if (key !== 'user_id' && key !== 'email') {
        builtArgs += `${commaCount > 0 ? ',' : ''} ${key}='${args[key]}'`;
        commaCount++;
      }
    }
    const query = `UPDATE users SET${builtArgs} WHERE user_id = '${args.user_id}' RETURNING user_id, first_name, last_name, email, password, roles, permissions, enabled, created, last_login`;

    const values = [args.user_id];
    return this.store.db
      .one(query, values)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        logger.log({ level: 'error', message: JSON.stringify(err) });
        err.message = err.code || 'none';
        return err;
      });
  }
}

module.exports = UserAPI;
