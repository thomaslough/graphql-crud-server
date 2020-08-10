const isEmail = require('isemail');
const { DataSource } = require('apollo-datasource');

class UserAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  /* initialize(config) {
    this.context = config.context;
  } */
  async login({ email: emailArg } = {}) {
    //const query = `SELECT * FROM users WHERE email = '${emailArg}'`;
    const query = `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = '${emailArg}' RETURNING *`;
    const values = [];

    return this.store.db
      .any(query, values)
      .then(res => {
        console.log('findUser res', res[0]);
        return res[0] ? res[0] : null;
      })
      .catch(err => {
        console.log('findUser err', err);
        return err;
      });
    // query db for user
  }
  async getUser({ id: idArg } = {}) {
    const query = `SELECT * FROM users WHERE id = '${idArg}'`;
    const values = [];

    return this.store.db
      .any(query, values)
      .then(res => {
        console.log('findUser res', res[0]);
        return res[0] ? res[0] : null;
      })
      .catch(err => {
        console.log('findUser err', err);
        return err;
      });
    // query db for user
  }
  async getUsers() {
    //userList
    const query = `SELECT * FROM users`;
    const values = [];

    return this.store.db
      .any(query, values)
      .then(res => {
        return res;
      })
      .catch(err => {
        console.log('getUsers err', err);
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
      ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $9, $10) RETURNING id`;

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
      args.creator_id
    ];

    return this.store.db
      .one(query, values)
      .then(res => {
        console.log('values', values);
        return res;
      })
      .catch(err => {
        console.log('err', err);
        err.message = err.code || 'none';
        return err;
      });
  }
  async removeUser({ id: idArg } = {}) {
    const query = `DELETE FROM users WHERE id = '${idArg}' RETURNING id`;
    const values = [idArg];

    return this.store.db
      .one(query, values)
      .then(res => {
        console.log('values', values);
        return res;
      })
      .catch(err => {
        console.log('err', err);
        err.message = err.code || 'none';
        return err;
      });
  }
  async updateUser(args) {
    let builtArgs = '';
    let commaCount = 0;
    for (let key in args) {
      if (key !== 'id' && key !== 'email') {
        builtArgs += `${commaCount > 0 ? ',' : ''} ${key}='${args[key]}'`;
        commaCount++;
      }
    }
    const query = `UPDATE users SET${builtArgs} WHERE id = '${
      args.id
    }' RETURNING id, first_name, last_name, password, roles, permissions, enabled, created, last_login`;

    const values = [args.id];
    return this.store.db
      .one(query, values)
      .then(res => {
        console.log('values', values);
        return res;
      })
      .catch(err => {
        console.log('err', err);
        err.message = err.code || 'none';
        return err;
      });
  }
}

module.exports = UserAPI;
