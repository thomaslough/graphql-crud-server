import 'cross-fetch/polyfill';
import { request } from '../test-utils/requestClient';

const userData = {};

describe('Should test users', () => {
  it('should be able to login as admin', async () => {
    const query = `
      mutation {
        login(email: "admin@email.com", password: "password") {
          token
        }
      }
    `;

    const { data } = await request(query);
    userData.token = data.login.token;
  });

  it('should be able to login as admin', async () => {
    const query = `
      query {
        users {
          user_id
          first_name
          last_name
          email
          roles
          permissions
          created
          last_login
        }
      }
    `;

    const { data } = await request(query, userData.token);

    expect(data.users).toBeDefined();
    expect(data.users.length).toBeGreaterThan(1);
  });
});
