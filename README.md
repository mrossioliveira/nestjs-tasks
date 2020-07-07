## Description

Backend services for NestJS learning.

I've built two clients to consume it:

### React-Tasks

A React web app with token based authentication, state management using [Context API](https://reactjs.org/docs/context.html) and hooks and some basic CSS animation.
You can check the project [here](https://github.com/mrossioliveira/react-tasks).

### Flutter-Tasks

A Flutter app with token based authentication, state management using [Provider](https://pub.dev/packages/provider) and [Sailor](https://pub.dev/packages/sailor) for routing.
You can check the project [here](https://github.com/mrossioliveira/flutter-tasks).

## Installation

This service is part of a microservices architecture and therefore you need to spin up the [authentication service](https://github.com/mrossioliveira/nestjs-tasks-auth) after this one.

## Running with Docker Compose

```bash
$ docker-compose up -d --build
```

You can check how to setup Docker Compose [here](https://docs.docker.com/compose/install/) in case you haven't done it yet.

> :warning: Make sure you also run the authentication service as stated in the Installation section.

## Running the app locally (needs Postgres running on localhost:5432)

Run a PostgreSQL instance on Docker:

```bash
$ docker run --name taskspostgres -p 5432:5432 -e POSTGRES_DB=task_dev -e POSTGRES_USER=task_dev -e POSTGRES_PASSWORD=password -d postgres
```

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Swagger

This project uses [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express). Access http://localhost:3000/api to see the docs.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
