# Eternal Server

![Build Status](https://api.travis-ci.org/jortizsao/eternal-server.svg?branch=master)
![codebeat badge](https://codebeat.co/badges/da34b901-773d-4a9e-b25d-83c1340619cb)
![Codacy Badge](https://api.codacy.com/project/badge/Grade/c5637197400e4cb8b784761415601136)

Eternal is a personal project of an e-commerce site based on the latest technologies in the backend as well as the frontend.

This repository refers to the backend side of the application. If you are interested in the frontend part, please check the following repository: [Eternal Client](https://github.com/jortizsao/eternal-client)

The two projects are completely decoupled. Thus, they are flexible enough that you can use both projects together, or the server side alone as API using your own frontend, or using your own backend with the Eternal frontend.

## Architecture

![ARCHITECTURE](<https://s3.amazonaws.com/eternal-documentation/eternal-architecture+(8).png>)

## Technologies

This is the list of technologies that the backend leans on:

* ### [commercetools](https://commercetools.com)
  The backend leans on [commercetools](https://commercetools.com) framework.

It’s a Commerce as a Service cloud platform that exposes an API with several endpoints and actions for the main entities of an e-commerce platform (products, carts, customers, orders, discounts, etc…).

Its flexibility leverages the use of technologies such as microservices and FaaS.

More information about commercetools API: http://dev.commercetools.com/

* ### [Apollo GraphQL Server](https://www.apollographql.com/docs/apollo-server/)

  The API is mainly a GraphQL API served by the Apollo Server, which is a library that helps you connect a GraphQL schema to an HTTP server in Node
  This server can be queried from any GraphQL client.

* ### [ExpressJS](http://expressjs.com/)
  The API is powered by this famous web application framework.
