import customers from '../api/customers';

export default app => {
  app.use('/api/customers', customers(app));
  app.use('/ping', (req, res) => res.send('I am alive'));

  // All other routes 404
  app.route('/*').get((req, res) => {
    res.sendStatus(404);
  });
};
