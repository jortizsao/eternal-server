import rp from 'request-promise';

export default ({ isCacheEnabled, cmsUrl, logger, cache }) => {
  logger.info(`CMS cache is ${isCacheEnabled ? 'Enabled' : 'Disabled'}`);

  return {
    getStory(slug, version, token) {
      if (isCacheEnabled) {
        if (version === 'draft') {
          return this.getFromCms(slug, version, token);
        } else {
          const storyFromCache = cache.get(slug, version);

          if (storyFromCache) {
            logger.debug('Hit from CMS cache. Slug: ', slug);
            return Promise.resolve(storyFromCache);
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
    },

    getFromCms(slug, version, token) {
      return rp({
        baseUrl: 'http://api.storyblok.com/v1/cdn',
        uri: 'spaces/me',
        qs: {
          token,
        },
        json: true,
      })
        .then(res => res.space.version)
        .then(cv => {
          console.log('cv', cv);

          return rp({
            baseUrl: cmsUrl,
            uri: slug,
            qs: {
              version,
              token,
              cv,
            },
            json: true,
          }).then(res => res.story);
        });
    },

    clearCache() {
      cache.clearCache();
    },
  };
};
