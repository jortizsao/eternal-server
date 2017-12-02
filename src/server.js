import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import { Engine as ApolloEngine } from 'apollo-engine';
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

function initApolloEngine({ app, apiKey }) {
  if (process.env.NODE_ENV === 'production') {
    const engine = new ApolloEngine({ engineConfig: { apiKey } });
    engine.start();
    app.use(engine.expressMiddleware());
  }
}

function getServer() {
  const container = Container();
  const config = container.resolve('config');
  const logger = container.resolve('logger');

  const app = express();

  initApolloEngine({ app, apiKey: config.get('APOLLO:ENGINE:KEY') });
  initMiddleware({ app });
  initModulesServerRoutes({ app, container });
  initErrorRoutes({ app });

  app.init = () => {
    const port = config.get('PORT');
    return app.listen(port, () => {
      logger.info(`Server listening on port ${port}`);
    });
  };

  return app;
}

export default getServer();
