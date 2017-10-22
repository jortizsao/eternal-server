import express from 'express';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import { SphereClient, Rest } from 'sphere-node-sdk';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';

import logger from './logger';
import utils from './utils';
import configuration from './config';
import bus from './bus';
import routes from './routes';

function initConfig(app) {
  app.config = configuration([
    path.join(__dirname, 'config/env/default.json'),
    path.join(__dirname, `config/env/${process.env.NODE_ENV || 'development'}.json`),
  ]);
}

function initLogger(app) {
  app.logger = logger(app.config);
}

function initUtils(app) {
  app.utils = utils(app.logger);
}

function initBus(app) {
  app.bus = bus(app);
}

function initCTClient(app) {
  if (process.env.NODE_ENV !== 'test') {
    const ctConfig = {
      config: {
        client_id: app.config.get('COMMERCE_TOOLS:CLIENT_ID'),
        client_secret: app.config.get('COMMERCE_TOOLS:CLIENT_SECRET'),
        project_key: app.config.get('COMMERCE_TOOLS:PROJECT_KEY'),
      },
      host: app.config.get('COMMERCE_TOOLS:API_HOST'),
      oauth_host: app.config.get('COMMERCE_TOOLS:OAUTH_URL'),
    };

    app.ctClient = new SphereClient(ctConfig);
    app.restCTClient = new Rest(ctConfig);
  }
}

function initMiddleware(app) {
  app.use(cors());
  app.use(compression());

  if (process.env.NODE_ENV === 'production') {
    app.use(
      morgan('combined', {
        skip: (req, res) => res.statusCode < 400, // Log only errors
      }),
    );
  } else {
    app.use(morgan('dev'));
  }
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(helmet());
  app.use(passport.initialize());
}

function initErrorRoutes(app) {
  app.use((err, req, res, next) => {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }
    // Log it
    app.logger.error(err.stack);
    res.sendStatus(500);
    // Redirect to error page
  });
}

function initModulesServerRoutes(app) {
  routes(app);
}

function getServer() {
  const app = express();

  initConfig(app);
  initLogger(app);
  initUtils(app);
  initBus(app);
  initCTClient(app);
  initMiddleware(app);
  initModulesServerRoutes(app);
  initErrorRoutes(app);

  return app;
}

export default getServer();
