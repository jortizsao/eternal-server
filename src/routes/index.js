// import graphql from '../graphql';

export default (app) => {
  // app.use('/api/graphql', graphql(app));

  // All other routes 404
  app.route('/*').get((req, res) => {
    res.sendStatus(404);
  });
};
