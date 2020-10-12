const { gql } = require('apollo-server-express');

const users = gql`
  #Schema here

  type User {
    user_id: ID!
    email: String
    first_name: String
    last_name: String
    roles: String
    permissions: String
    enabled: Boolean
    message: String
    service: String
    creation_date: String
    last_login: String
    error: String
    token: String
  }

  interface Error {
    message: String!
  }

  type BadUserCredsError implements Error {
    message: String!
  }

  type UnauthorizedError implements Error {
    message: String!
  }

  type UserExists implements Error {
    message: String!
  }

  type BadFormat implements Error {
    message: String!
  }

  union UserResponse =
      User
    | BadUserCredsError
    | UnauthorizedError
    | UserExists
    | BadFormat

  type Query {
    "Get All Users"
    users: [User]!
    "Get single user based on id"
    user(user_id: String!): User!
  }

  type Mutation {
    login(email: String!, password: String!): UserResponse!

    addUser(
      email: String!
      first_name: String!
      last_name: String!
      password: String!
      enabled: Boolean!
      creation_date: String
      last_login: String
    ): UserResponse!
    removeUser(user_id: String!): User!
    updateUser(
      user_id: String!
      first_name: String
      last_name: String
      roles: String
      enabled: Boolean
    ): User!
  }
`;

module.exports = users;
