import { Router } from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import graphqlSchema from '../graphql/schema';
import CustomersRest from '../api/customers/rest';
import Cms from '../api/cms';

export default ({ app, container }) => {
  const router = new Router();

  const customersService = container.resolve('customersService');
  const customersController = container.resolve('customersController');
  const cmsController = container.resolve('cmsController');
  const authenticateMiddleware = container.resolve('authenticateMiddleware');

  app.use('/api/customers', CustomersRest({ router, customersController, authenticateMiddleware }));
  app.use('/api/cms', Cms({ router, cmsController }));
  app.use('/ping', (req, res) => res.send('I am alive'));

  app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress({
      schema: graphqlSchema,
      context: {
        customersService,
      },
    }),
  );
  app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

  // All other routes 404
  app.route('/*').get((req, res) => {
    res.sendStatus(404);
  });
};
