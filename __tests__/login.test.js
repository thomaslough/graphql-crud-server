import 'cross-fetch/polyfill';
import { request } from '../test-utils/requestClient';

describe('Should test account logins', () => {
  it('should be able to login as admin', async () => {
    const query = `
      mutation {
        login(email: "admin@email.com", password:"password") {
          user_id
          first_name
          last_name
          email
          roles
          permissions
          token
          created
          last_login
        }
      }
    `;

    const { data } = await request(query);
    expect(data.login).toExist;
    expect(data.login.first_name).toBe('Jane');
    expect(data.login.last_name).toBe('Doe');
    expect(data.login.email).toBe('admin@email.com');
    expect(data.login.roles).toBe('["ADMIN"]');
    expect(data.login.permissions).toBe(
      '["read:any_account", "read:own_account"]'
    );
    expect(data.login.token).not.toBeUndefined();
    expect(data.login.created).not.toBeUndefined();
    expect(data.login.last_login).not.toBeUndefined();
    expect(data.login.password).toBeUndefined();
  });

  it('should be able to login as user', async () => {
    const query = `
      mutation {
        login(email: "user@email.com", password: "password") {
          user_id
          first_name
          last_name
          email
          roles
          permissions
          token
          created
          last_login
        }
      }
    `;

    const { data } = await request(query);

    expect(data.login).toExist;
    expect(data.login.first_name).not.toBeUndefined();
    expect(data.login.last_name).not.toBeUndefined();
    expect(data.login.email).toBe('user@email.com');
    expect(data.login.roles).toBe('["USER"]');
    expect(data.login.permissions).toBe('["read:own_account"]');
    expect(data.login.token).not.toBeUndefined();
    expect(data.login.created).not.toBeUndefined();
    expect(data.login.last_login).not.toBeUndefined();
    expect(data.login.password).toBeUndefined();
  });

  it('should not be able to login with bad email cred', async () => {
    const query = `
      mutation {
        login(email: "xxx@email.com", password: "password") {
          user_id
          first_name
          last_name
          email
          roles
          permissions
          token
          created
          last_login
        }
      }
    `;

    try {
      await request(query);
    } catch (err) {
      expect(err.graphQLErrors).toExist;
      expect(err.graphQLErrors).toBeArray;
      expect(err.graphQLErrors[0]).toExist;
      expect(err.graphQLErrors[0].message).toExist;
      expect(err.graphQLErrors[0].message).toContain('Not Authorised!');
    }
  });

  it('should not be able to login with bad password cred', async () => {
    const query = `
      mutation {
        login(email: "admin@email.com", password: "xxxxxxx") {
          user_id
          first_name
          last_name
          email
          roles
          permissions
          token
          created
          last_login
        }
      }
    `;

    try {
      await request(query);
    } catch (err) {
      expect(err.graphQLErrors).toExist;
      expect(err.graphQLErrors).toBeArray;
      expect(err.graphQLErrors[0]).toExist;
      expect(err.graphQLErrors[0].message).toExist;
      expect(err.graphQLErrors[0].message).toContain(
        'Cannot return null for non-nullable field'
      );
    }
  });
});
