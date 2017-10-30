import Cache from '../cms.cache';
import Config from '../../../config';
import Logger from '../../../logger';

describe('CMS', () => {
  describe('Cache', () => {
    const config = Config();
    const logger = Logger({ config });
    const cache = Cache({ logger });

    let story;

    beforeEach(() => {
      cache.clearCache();
      story = {
        id: 'id1',
        slug: 'home',
        full_slug: 'en/home',
      };
    });

    it('should store a story into the cache', () => {
      cache.store(story, 'published');

      expect(cache.getCache()).toEqual({
        'en/home': {
          published: {
            id: 'id1',
            slug: 'home',
            full_slug: 'en/home',
          },
        },
      });
    });

    it('should get a story from the cache', () => {
      cache.store(story, 'published');

      expect(cache.get('en/home', 'published')).toEqual(story);
      expect(cache.get('en/home', 'draft')).toBeUndefined();
      expect(cache.get('home', 'published')).toBeUndefined();
    });
  });
});
