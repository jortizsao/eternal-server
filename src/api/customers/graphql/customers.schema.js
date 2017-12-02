import { makeExecutableSchema } from 'graphql-tools';
import customerTypes from './customers.types';
import resolvers from './customers.resolvers';

export default makeExecutableSchema({
  typeDefs: [customerTypes],
  resolvers,
});
