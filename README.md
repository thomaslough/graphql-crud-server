# graphql-crud-server

## What is it?

### A GraphQL CRUD dev server using Express, Apollo Grapghql, Postgres JWT and Graphql-shield. This project uses Apollo federation with a gateway for use as a microservice.

## install

\$ npm -i

## Setup

### PostgreSQL

- After installing [PostgreSQL](https://www.postgresql.org/download/), open up [PgAdmin](https://www.pgadmin.org/) (GUI for exploring your Postgres server) and create a new database. You will use the name of the newly created database name for "POSTGRES_DB" in your .env file

- Create .env file

- Setup .env file
  ```
  POSTGRES_HOST=localhost
  POSTGRES_PORT=5432
  POSTGRES_DB={databaseName}
  POSTGRES_USER={postgres user}
  POSTGRES_PASSWORD={postgres password}
  ```
- \$ npm run seed

## Run development server

\$ npm start

## Run development server with gateway

\$ npm run gateway

## Run Tests

\$ npm test

## GrapghQL Playground

http://localhost:4000/api
