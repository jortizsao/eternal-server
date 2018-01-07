import { createSyncCustomers } from '@commercetools/sync-actions';
import { createContainer, asFunction, Lifetime } from 'awilix';
import Utils from '../utils';
import Config from '../config';
import Logger from '../logger';
import CommerceTools from '../commercetools';
import AuthenticateLocalMiddleware from '../authenticate/middlewares/local.middleware';
import AuthenticateLocalStrategy from '../authenticate/strategies/local.strategy';
import AuthorizeJwtService from '../authorize/services/jwt.service';
import CmsCache from '../api/cms/cms.cache';
import CustomersService from '../api/customers/service';
import CmsController from '../api/cms/cms.controller';
import CmsService from '../api/cms/cms.service';
import CommonsService from '../api/commons/commons.service';
import CustomObjectsService from '../api/custom-objects/custom-objects.service';

export default function () {
  const container = createContainer();

  function getCommonsService(_container, entity) {
    return CommonsService({ commercetools: _container.resolve('commercetools'), entity });
  }

  function getAuthenticateMiddlewareParams(_container) {
    return {
      authenticateStrategy: _container.resolve('authenticateStrategy'),
    };
  }

  function getCustomersServiceParams(_container) {
    const config = _container.resolve('config');

    return {
      customersSequence: config.get('COMMERCE_TOOLS:SEQUENCES:CUSTOMERS'),
      commercetools: _container.resolve('commercetools'),
      commonsService: getCommonsService(_container, 'customers'),
      authorizeService: _container.resolve('commercetools'),
      syncCustomers: createSyncCustomers(),
      utils: _container.resolve('utils'),
    };
  }

  function getCmsControllerParams(_container) {
    const config = _container.resolve('config');

    return {
      privateToken: config.get('CMS:PRIVATE_ACCESS_TOKEN'),
      publicToken: config.get('CMS:PUBLIC_ACCESS_TOKEN'),
      logger: _container.resolve('logger'),
      cmsService: _container.resolve('cmsService'),
    };
  }

  function getCmsServiceParams(_container) {
    const config = _container.resolve('config');

    return {
      isCacheEnabled: !!config.get('CMS:CACHE_ENABLED'),
      cmsUrl: config.get('CMS:URL'),
      logger: _container.resolve('logger'),
      cache: _container.resolve('cache'),
    };
  }

  function getCommerceToolsParams(_container) {
    const config = _container.resolve('config');

    return {
      clientId: config.get('COMMERCE_TOOLS:CLIENT_ID'),
      clientSecret: config.get('COMMERCE_TOOLS:CLIENT_SECRET'),
      projectKey: config.get('COMMERCE_TOOLS:PROJECT_KEY'),
      host: config.get('COMMERCE_TOOLS:API_HOST'),
      oauthHost: config.get('COMMERCE_TOOLS:OAUTH_URL'),
      concurrency: config.get('COMMERCE_TOOLS:CONCURRENCY'),
    };
  }

  function getAuthorizeJwtServiceParams(_container) {
    const config = _container.resolve('config');

    return {
      passphrase: config.get('TOKEN:SECRET'),
      expiresIn: config.get('TOKEN:MAX_AGE_SECONDS'),
    };
  }

  function getSingleton(instance, injectParamsFunction) {
    return injectParamsFunction
      ? asFunction(instance)
          .inject(injectParamsFunction)
          .singleton()
      : asFunction(instance).singleton();
  }

  container.loadModules(
    ['app/api/**/*.controller.js', 'app/api/**/*.service.js', 'app/api/**/*.utils.js'],
    {
      formatName: 'camelCase',
      registrationOptions: {
        lifetime: Lifetime.SINGLETON,
      },
    },
  );

  container.register({
    utils: getSingleton(Utils),
    config: getSingleton(Config),
    logger: getSingleton(Logger),
    commercetools: getSingleton(CommerceTools, getCommerceToolsParams),
    authenticateMiddleware: getSingleton(
      AuthenticateLocalMiddleware,
      getAuthenticateMiddlewareParams,
    ),
    authenticateStrategy: getSingleton(AuthenticateLocalStrategy),
    authorizeService: getSingleton(AuthorizeJwtService, getAuthorizeJwtServiceParams),
    cache: getSingleton(CmsCache),
    customersService: getSingleton(CustomersService, getCustomersServiceParams),
    cmsController: getSingleton(CmsController, getCmsControllerParams),
    cmsService: getSingleton(CmsService, getCmsServiceParams),
    customObjectsService: getSingleton(CustomObjectsService, _container => ({
      commonsService: getCommonsService(_container, 'customObjects'),
    })),
  });

  return container;
}
