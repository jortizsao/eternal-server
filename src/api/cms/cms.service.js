import rp from 'request-promise';

export default ({ isCacheEnabled, cmsUrl, logger, cache }) => {
  logger.info(`CMS cache is ${isCacheEnabled ? 'Enabled' : 'Disabled'}`);

  return {
    getStory(slug, version, token) {
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
