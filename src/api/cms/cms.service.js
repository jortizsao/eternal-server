import rp from 'request-promise';

export default app => {
  const service = {};
  const config = app.config;
  const logger = app.logger;
  let cache = {};

  logger.info(`CMS cache is ${config.get('CMS:CACHE_ENABLED') ? 'Enabled' : 'Disabled'}`);

  service.getStory = (slug, version, token) => {
    const isCacheEnabled = !!config.get('CMS:CACHE_ENABLED');

    return Promise.resolve().then(() => {
      if (isCacheEnabled) {
        if (version === 'draft') {
          return service.getFromCms(slug, version, token);
        } else {
          const storyFromCache = service.getFromCache(slug, version);

          if (storyFromCache) {
            logger.debug('Hit from CMS cache. Slug: ', slug);
            return storyFromCache;
          } else {
            logger.debug('Miss from CMS cache. Slug: ', slug);
            return service.getFromCms(slug, version, token).then(story => {
              service.storeInCache(story, version);
              return story;
            });
          }
        }
      } else {
        return service.getFromCms(slug, version, token);
      }
    });
  };

  service.getFromCms = (slug, version, token) => {
    const cmsUrl = config.get('CMS:URL');

    return rp({
      baseUrl: cmsUrl,
      uri: slug,
      qs: {
        version,
        token,
      },
      json: true,
    }).then(res => res.story);
  };

  service.storeInCache = (story, version) => {
    logger.debug('Storing in cache. Slug: %s, Version: %s', story.full_slug, version);
    const versionObj = {};
    versionObj[version] = story;
    cache[story.full_slug] = {
      ...cache[story.full_slug],
      ...versionObj,
    };
  };

  service.getFromCache = (slug, version) => {
    logger.debug('Getting from cache. Slug: %s, Version: %s', slug, version);
    return cache[slug] ? cache[slug][version] : undefined;
  };

  service.getCache = () => {
    return cache;
  };

  service.clearCache = () => {
    cache = {};
  };

  return service;
};
