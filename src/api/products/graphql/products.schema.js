import { makeExecutableSchema } from 'graphql-tools';
import productsTypes from './products.types';
import productResolvers from './products.resolvers';
import commonResolvers from '../../commons/graphql/resolvers/commons.resolvers';
import imageResolvers from '../../commons/graphql/resolvers/image.resolvers';

export default () =>
  makeExecutableSchema({
    typeDefs: [productsTypes],
    resolvers: { ...commonResolvers, ...imageResolvers, ...productResolvers },
  });
