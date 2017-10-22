import customers from '../api/customers';
import cms from '../api/cms';

export default app => {
  app.use('/api/customers', customers(app));
  app.use('/api/cms', cms(app));
  app.use('/ping', (req, res) => res.send('I am alive'));

  // All other routes 404
  app.route('/*').get((req, res) => {
    res.sendStatus(404);
  });
};
