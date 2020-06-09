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

```bash
$ npm install
```

## Running with Docker Compose

```bash
$ docker-compose up -d --build
```

You can check how to setup Docker Compose [here](https://docs.docker.com/compose/install/) in case you haven't done it yet.

## Running the app locally (needs Postgres running on localhost:5432)

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

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
