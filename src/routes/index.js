import { Router } from 'express';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'express-jwt';
import CustomersRest from '../api/customers/rest';
import Cms from '../api/cms';

export default ({ app, container }) => {
  const router = new Router();

  const customersService = container.resolve('customersService');
  const productsService = container.resolve('productsService');
  const customersController = container.resolve('customersController');
  const cmsController = container.resolve('cmsController');
  const authenticateMiddleware = container.resolve('authenticateMiddleware');
  const graphqlSchema = container.resolve('graphqlSchema');
  const config = container.resolve('config');

  const apolloServer = new ApolloServer({
    schema: graphqlSchema,
    context: ({ req }) => ({
      customersService,
      productsService,
      authUser: req.user,
    }),
    tracing: process.env.NODE_ENV === 'production',
    cacheControl:
      process.env.NODE_ENV === 'production'
        ? {
          defaultMaxAge: config.get('APOLLO:ENGINE:CACHE_DEFAULT_MAX_AGE') || 240,
        }
        : false,
  });

  app.use('/api/customers', CustomersRest({ router, customersController, authenticateMiddleware }));
  app.use('/api/cms', Cms({ router, cmsController }));
  app.use('/ping', (req, res) => res.send('I am alive'));

  app.use('/graphql', jwt({ secret: config.get('TOKEN:SECRET'), credentialsRequired: false }));
  apolloServer.applyMiddleware({
    app,
  });

  // All other routes 404
  app.route('/*').get((req, res) => {
    res.sendStatus(404);
  });
};
