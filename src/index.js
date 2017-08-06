import application from './server';

function init(app) {
  return app.listen(app.config.get('PORT'), () => {
    app.logger.info(`Server listening on port ${app.config.get('PORT')}`);
  });
}

export default init(application());
