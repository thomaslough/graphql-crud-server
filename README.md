# graphql-crud-server

## What is it?

### A GraphQL CRUD dev server using express, grapghql, postgres jwt and graphql-shield

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
  POSTGRES_DB=databaseName
  POSTGRES_USER=postgres
  POSTGRES_PASSWORD=postgres
  ```
- \$ npm run seed

## Run Development Server

\$ npm start

## Tests

TBD
