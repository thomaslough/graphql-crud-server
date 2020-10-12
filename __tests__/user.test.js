import 'cross-fetch/polyfill';
import { request } from '../test-utils/requestClient';

const userData = {};

describe('Should test user as user', () => {
  it('should be able to login as user', async () => {
    const query = `
    mutation {
      login(email: "user@email.com", password:"password") {
           __typename
          ... on User {
          user_id
          first_name
          last_name
          email
          roles
          permissions
          token
          creation_date
          last_login
          error
          }
          ... on BadUserCredsError {
              message
          }
        }
      }
    `;

    const res = await request(query);
    expect(res.data).toBeDefined();
    userData.token = res.data.login.token;
  });

  it('should not be able to get users as user', async () => {
    const query = `
      query {
        users {
          user_id
          first_name
          last_name
          email
          roles
          permissions
          creation_date
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

  it('should be able to get its own user data as user', async () => {
    const query = `
      query {
        user (user_id: "2") {
          user_id
          first_name
          last_name
          email
          roles
          permissions
          creation_date
          last_login
          enabled
        }
      }
    `;

    const { data } = await request(query, userData.token);
    expect(data.user).toBeDefined();
    expect(data.user.user_id).toEqual('2');
    expect(data.user.email).toEqual('user@email.com');
    expect(data.user.roles).toEqual('["USER"]');
    expect(data.user.permissions).toEqual('["read:own_account"]');
  });

  it('should be able to update own first and last name', async () => {
    const query = `
    mutation {
      updateUser (user_id: "2", first_name: "Updated First Name", last_name: "Updated Last Name") {
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
    expect(data.updateUser).toBeDefined();
    expect(data.updateUser.user_id).toEqual('2');
    expect(data.updateUser.first_name).toEqual('Updated First Name');
    expect(data.updateUser.email).toEqual('user@email.com');
    expect(data.updateUser.roles).toEqual('["USER"]');
    expect(data.updateUser.permissions).toEqual('["read:own_account"]');
  });

  it('should not be able to update roles', async () => {
    const query = `
    mutation {
      updateUser (user_id: "2", roles: "ADMIN") {
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

  it('should not be able to get anothers user data as user', async () => {
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

  it('should not be able to create a user as user', async () => {
    const query = `
      mutation {
        addUser (
          email: "some.user@email.com",
          first_name: "New", 
          last_name: "User",
          password: "password",
          enabled: true
          ) {
          __typename
          ... on User {
              user_id
              first_name
              last_name
              email
              roles
              permissions
              token
              creation_date
              last_login
          }
          ... on UserExists {
              message
          }
        }
      }
    `;

    const { errors } = await request(query, userData.token);
    expect(errors).toBeDefined();
    expect(errors[0]).toBeDefined();
    expect(errors[0].message).toBeDefined();
    expect(errors[0].message).toEqual('Not Authorised!');
  });
  it('should not be able to update any other user as user', async () => {
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
  it('should not be able to delete user as user', async () => {
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
