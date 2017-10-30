import rp from 'request-promise';

export default ({ config, logger, cache }) => {
  logger.info(`CMS cache is ${config.get('CMS:CACHE_ENABLED') ? 'Enabled' : 'Disabled'}`);

  return {
    getStory(slug, version, token) {
      const isCacheEnabled = !!config.get('CMS:CACHE_ENABLED');

      return Promise.resolve().then(() => {
        if (isCacheEnabled) {
          if (version === 'draft') {
            return this.getFromCms(slug, version, token);
          } else {
            const storyFromCache = cache.get(slug, version);

            if (storyFromCache) {
              logger.debug('Hit from CMS cache. Slug: ', slug);
              return storyFromCache;
            } else {
              logger.debug('Miss from CMS cache. Slug: ', slug);
              return this.getFromCms(slug, version, token).then(story => {
                cache.store(story, version);
                return story;
              });
            }
          }
        } else {
          return this.getFromCms(slug, version, token);
        }
      });
    },

    getFromCms(slug, version, token) {
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
    },

    clearCache() {
      cache.clearCache();
    },
  };
};
