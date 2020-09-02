import 'cross-fetch/polyfill';
import { request } from '../test-utils/requestClient';

const userData = {};

describe('Should test user, user', () => {
  it('should be able to login as admin', async () => {
    const query = `
      mutation {
        login(email: "user@email.com", password: "password") {
          token
        }
      }
    `;

    const { data } = await request(query);
    expect(data).toBeDefined();
    userData.token = data.login.token;
  });

  it('should not be able to get users', async () => {
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

    const { errors } = await request(query, userData.token);
    expect(errors).toBeDefined();
    expect(errors[0]).toBeDefined();
    expect(errors[0].message).toBeDefined();
    expect(errors[0].message).toEqual('Not Authorised!');
  });

  it('should be able to get its own user data', async () => {
    const query = `
      query {
        user (user_id: "2") {
          user_id
          first_name
          last_name
          email
          roles
          permissions
        }
      }
    `;

    const { data } = await request(query, userData.token);

    expect(data.user).toBeDefined();
    expect(data.user.user_id).toEqual('2');
    expect(data.user.first_name).toEqual('John');
    expect(data.user.last_name).toEqual('Doe');
    expect(data.user.email).toEqual('user@email.com');
    expect(data.user.roles).toEqual('["USER"]');
    expect(data.user.permissions).toEqual('["read:own_account"]');
  });

  it('should not be able to get anothers user data', async () => {
    const query = `
      query {
        user (user_id: "1") {
          user_id
          first_name
          last_name
          email
          roles
          permissions
        }
      }
    `;

    const { errors } = await request(query, userData.token);
    expect(errors).toBeDefined();
    expect(errors[0]).toBeDefined();
    expect(errors[0].message).toBeDefined();
    expect(errors[0].message).toEqual('Not Authorised!');
  });

  it('should not be able to create a user', async () => {
    const query = `
      mutation {
        addUser (
          email: "spike.punch@email.com",
          first_name: "Spike", 
          last_name: "Punch",
          password: "Cake",
          roles: "['USER']", 
          permissions: "['read:own_account']",
          enabled: true, 
          creator_id: "1"
          ) {
          user_id
        }
      }
    `;

    const { errors } = await request(query, userData.token);
    expect(errors).toBeDefined();
    expect(errors[0]).toBeDefined();
    expect(errors[0].message).toBeDefined();
    expect(errors[0].message).toEqual('Not Authorised!');
  });
  it('should not be able to update a user', async () => {
    const query = `
    mutation {
      updateUser (user_id: "1", first_name: "Updated First Name", last_name: "Updated Last Name") {
        user_id
        first_name
        last_name
        email
        roles
        permissions
      }
    }
    `;

    const { errors } = await request(query, userData.token);
    expect(errors).toBeDefined();
    expect(errors[0]).toBeDefined();
    expect(errors[0].message).toBeDefined();
    expect(errors[0].message).toEqual('Not Authorised!');
  });
  it('should not be able to delete user', async () => {
    const query = `
    mutation {
      removeUser (user_id: "1") {
        user_id
      }
    }
    `;

    const { errors } = await request(query, userData.token);
    expect(errors).toBeDefined();
    expect(errors[0]).toBeDefined();
    expect(errors[0].message).toBeDefined();
    expect(errors[0].message).toEqual('Not Authorised!');
  });
});
