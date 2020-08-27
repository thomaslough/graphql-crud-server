const { gql } = require('apollo-server-express');

const typeDefs = gql`
  #Schema here

  type User {
    user_id: ID!
    email: String
    first_name: String
    last_name: String
    roles: String
    permissions: String
    enabled: Boolean!
    creator_id: String
    message: String
    service: String
    created: String
    last_login: String
    error: String
    token: String
  }

  type Query {
    "Get All Users"
    users: [User]!
    "Get single user based on id"
    user(user_id: String!): User
  }

  type Mutation {
    login(email: String!, password: String!): User!

    addUser(
      email: String!
      first_name: String!
      last_name: String!
      password: String!
      roles: String!
      enabled: Boolean!
      permissions: String!
      creator_id: String!
      created: String
      last_login: String
    ): User!
    removeUser(user_id: String!): User!
    updateUser(
      user_id: String!
      first_name: String
      last_name: String
      role: String
      enabled: Boolean
    ): User!
  }
`;

module.exports = typeDefs;
