import { Router } from 'express';
import Customers from '../api/customers';
import Cms from '../api/cms';

export default ({ app, container }) => {
  const router = new Router();
  app.use('/api/customers', Customers({ router, container }));
  app.use('/api/cms', Cms({ router, container }));
  app.use('/ping', (req, res) => res.send('I am alive'));

  // All other routes 404
  app.route('/*').get((req, res) => {
    res.sendStatus(404);
  });
};
