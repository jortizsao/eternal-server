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

function initErrorRoutes({ app, logger }) {
  app.use((err, req, res, next) => {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }

    logger.error(err.stack);
    return res.sendStatus(500);
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
