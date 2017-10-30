export default ({ logger }) => {
  let cache = {};

  return {
    store(story, version) {
      logger.debug('Storing in cache. Slug: %s, Version: %s', story.full_slug, version);
      const versionObj = {};
      versionObj[version] = story;
      cache[story.full_slug] = {
        ...cache[story.full_slug],
        ...versionObj,
      };
    },

    get(slug, version) {
      logger.debug('Getting from cache. Slug: %s, Version: %s', slug, version);
      return cache[slug] ? cache[slug][version] : undefined;
    },

    getCache() {
      return cache;
    },

    clearCache() {
      cache = {};
    },
  };
};
