import customers from '../api/customers';

export default (app) => {
  app.use('/api/customers', customers(app));

  // All other routes 404
  app.route('/*').get((req, res) => {
    res.sendStatus(404);
  });
};
