import { createContainer, asFunction, Lifetime } from 'awilix';
import Utils from '../utils';
import Config from '../config';
import Logger from '../logger';
import CommerceTools from '../commercetools';
import AuthMiddleware from '../auth/middlewares/auth.middleware';
import AuthLocalStrategy from '../auth/strategies/local-strategy';
import CmsCache from '../api/cms/cms.cache';

export default () => {
  const container = createContainer();

  container.register({
    utils: asFunction(Utils).singleton(),
    config: asFunction(Config).singleton(),
    logger: asFunction(Logger).singleton(),
    commercetools: asFunction(CommerceTools).singleton(),
    authMiddleware: asFunction(AuthMiddleware)
      .inject(c => ({
        authStrategies: [c.resolve('authLocalStrategy')],
      }))
      .singleton(),
    authLocalStrategy: asFunction(AuthLocalStrategy).singleton(),
    cache: asFunction(CmsCache).singleton(),
  });

  container.loadModules(
    ['app/api/*/*.controller.js', 'app/api/*/*.service.js', 'app/api/*/*.utils.js'],
    {
      formatName: 'camelCase',
      registrationOptions: {
        lifetime: Lifetime.SINGLETON,
      },
    },
  );

  return container;
};
