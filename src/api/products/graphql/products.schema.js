import { makeExecutableSchema } from 'graphql-tools';
import productsTypes from './products.types';
import resolvers from './products.resolvers';

export default () =>
  makeExecutableSchema({
    typeDefs: [productsTypes],
    resolvers,
  });
