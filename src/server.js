import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import { ApolloEngine } from 'apollo-engine';
import routes from './routes';
import Container from './container';
import { ValidationError, NotAuthenticatedError, CommercetoolsError } from './errors';

function initMiddleware({ app }) {
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

function sendError(res, err, statusCode) {
  return res.status(statusCode).json({
    code: err.code || statusCode,
    error: err.constructor.name,
    message: err.message,
    ...(err.errors && { errors: err.errors }),
  });
}

function handleError({ err, res, logger }) {
  if (err instanceof ValidationError) {
    return sendError(res, err, 400);
  } else if (err instanceof NotAuthenticatedError) {
    return sendError(res, err, 401);
  } else if (err instanceof CommercetoolsError) {
    if (err.code >= 500) {
      logger.error(JSON.stringify(err));
    }

    return sendError(res, err, err.code);
  } else {
    // If any of the previous middlewares has a "not managed error" we log it and return HTTP 500
    logger.error(err.stack);
    return sendError(res, err, 500);
  }
}

function initErrorRoutes({ app, logger }) {
  app.use((err, req, res, next) => {
    if (!err) {
      return next();
    }

    return handleError({ err, res, logger });
  });
}

function initModulesServerRoutes({ app, container }) {
  routes({ app, container });
}

function initApolloEngine({ apiKey }) {
  return new ApolloEngine({
    apiKey,
    frontends: [
      {
        overrideGraphqlResponseHeaders: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    ],
    // stores: [
    //   {
    //     name: 'privateResponseMemcache',
    //     memcache: {
    //       url: ['eternal-memcache'],
    //     },
    //   },
    // ],
  });
}

function getServer() {
  const container = Container();
  const config = container.resolve('config');
  const logger = container.resolve('logger');
  const port = config.get('PORT');

  const app = express();

  initMiddleware({ app });
  initModulesServerRoutes({ app, container });
  initErrorRoutes({ app, logger });

  if (process.env.NODE_ENV === 'production') {
    const engine = initApolloEngine({ app, apiKey: config.get('APOLLO:ENGINE:KEY') });

    app.init = () =>
      engine.listen(
        {
          port,
          expressApp: app,
        },
        () => {
          logger.info(`Server listening on port ${port}`);
        },
      );
  } else {
    app.init = () =>
      app.listen(port, () => {
        logger.info(`Server listening on port ${port}`);
      });
  }

  return app;
}

export default getServer();
