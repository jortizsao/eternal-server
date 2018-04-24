# Eternal Server

![Build Status](https://api.travis-ci.org/jortizsao/eternal-server.svg?branch=master)
![codebeat badge](https://codebeat.co/badges/da34b901-773d-4a9e-b25d-83c1340619cb)
![Codacy Badge](https://api.codacy.com/project/badge/Grade/c5637197400e4cb8b784761415601136)

Eternal is a personal project of an e-commerce site based on the latest technologies in the backend as well as the frontend.

This repository refers to the backend side of the application ("eternal server" in the architecture diagram).

If you are interested in the frontend part, please check the following repository: [Eternal Client](https://github.com/jortizsao/eternal-client)

The two projects are completely decoupled. Thus, they are flexible enough, that you can use both projects together, or the server side alone as API using your own frontend, or using your own backend with the Eternal frontend.

## Demo

I have a working demo of both projects (client and server) deployed on AWS as described in the architecture diagram that you can find down below.

If you are interested in seeing this demo in action, please contact me at javier.ortizsaorin@gmail.com to arrange a meeting.

![enter image description here](https://s3.amazonaws.com/eternal-architecture/eternal4.gif)

![enter image description here](https://s3.amazonaws.com/eternal-architecture/eternal2.gif)

## Architecture

![ARCHITECTURE](https://s3.amazonaws.com/eternal-architecture/eternal-architecture.png)

## 10000 foot view technologies

This is the overall list of technologies that the backend leans on:

* ### [commercetools](https://commercetools.com)

The backend leans on [commercetools](https://commercetools.com) framework.

It’s a Commerce as a Service cloud platform that exposes an API with several endpoints and actions for the main entities of an e-commerce platform (products, carts, customers, orders, discounts, etc…).

Its flexibility leverages the use of technologies such as microservices and FaaS.

More information about commercetools API: http://dev.commercetools.com/

* ### [Apollo GraphQL Server](https://www.apollographql.com/docs/apollo-server/)

The API is mainly a GraphQL API served by the Apollo Server, which is a library that helps you connect a GraphQL schema to an HTTP server in node.js

This API can be queried from any GraphQL client.

* ### [Express.js](http://expressjs.com/)
  The API is powered by this famous web application server.

In order to scale the API as much as possible, this server is completely stateless, thus, it doesn't store any sessions for identifying/authenticating the requests.

It uses [JWT](https://jwt.io/) tokens instead. This mechanism identifies each http request by adding the JWT token in the http Authentication header.

Once the request is handled by the server, this token is verified and decoded.

If the token is invalid or expired, the server responds with a 401 http error.

If the token is valid, the decoded payload is used by the subsequent layers to authorised the request.

* ### [AWS SNS](https://aws.amazon.com/sns/)

All asynchronous operations are handled by an event driven architecture.

The hub of these events is the [AWS SNS](https://aws.amazon.com/sns/) service.

This service is a pub/sub service that decouples the publisher from the subscribers, allowing to fan-out messages to a large number of subscribers.

In this particular architecture, the messages are emitted by commercetools using the [subscriptions](https://docs.commercetools.com/http-api-projects-subscriptions.html) API, and the subscribers are several [AWS Lambda](https://aws.amazon.com/lambda/) functions that process these messages accordingly.

A use case for these async events could be:

**Publisher**:
Event is triggered when a new order is placed

**Subscribers** (a single AWS Lambda per each): - Send an order confirmation email to the customer - Sync the order with 3rd parties services such as shipping services, marketing services, accounting services, etc... - Reporting. The order data can be synced to a reporting database where you can run reports based on different criteria

This is just a simple example but this architecture doesn't have limits either in performance or functionality.

## Development tools

This project includes the following development tools already configured:

* **[Express.js](http://expressjs.com/)**: node.js web framework
* **commercetools** client: Official [ node.js sdk](https://commercetools.github.io/nodejs)
* **GraphQL**: [Apollo Server](https://www.apollographql.com/docs/apollo-server/) is the server that provides the GraphQL API. In "production" mode the server is also connected to [Apollo Engine](https://www.apollographql.com/engine) to monitor the queries and leverage the [query cache](https://www.apollographql.com/docs/engine/caching.html).
* **Unit tests**: [Jasmine](https://github.com/jasmine/jasmine) is already configured to run your tests and generate the coverage report
* **Logger**: A [Winston](https://github.com/winstonjs/winston) logger is included and configured.
* **Config**: The configuration is managed via [nconf](https://github.com/indexzero/nconf)
* **Transpiler**: [Babel](https://babeljs.io/) is configured with target **node.js >= 8.x.x** and [stage 3 preset](https://babeljs.io/docs/plugins/preset-stage-3/)
* **Linter**: [ESLint](https://eslint.org/) with [AirBnB rules](https://github.com/airbnb/javascript)
* **Formatter**: [Prettier](https://github.com/prettier/prettier) has been added to format the code following the ESLint rules before any commit.
* **Commit Validation**: Each commit message is validated by [validate-commit](https://github.com/willsoto/validate-commit) using the [JSHint preset](https://github.com/willsoto/validate-commit/blob/master/conventions/jshint.md)
* **Dockerfile**: A Dockerfile is included in order to create the docker image

## Contact

If you have any questions or suggestions feel free to contact me:

Javier Ortiz Saorin javier.ortizsaorin@gmail.com
