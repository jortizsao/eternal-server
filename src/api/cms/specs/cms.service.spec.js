import nock from 'nock';
import CmsService from '../cms.service';
import Cache from '../cms.cache';
import Config from '../../../config';
import Logger from '../../../logger';

describe('CMS', () => {
  describe('Service', () => {
    const config = Config();
    const logger = Logger({ config });
    const cache = Cache({ logger });
    let isCacheEnabled = true;
    const cmsUrl = 'http://thisismycms.com';
    let cmsService = CmsService({ isCacheEnabled, cmsUrl, logger, cache });
    let story;

    beforeEach(() => {
      cmsService.clearCache();
      story = {
        id: 'id1',
        slug: 'home',
        full_slug: 'en/home',
      };
    });

    describe('stories', () => {
      it('should return the story from cache if exists and it is the published version', done => {
        spyOn(cache, 'get').and.returnValue(Promise.resolve(story));
        spyOn(cmsService, 'getFromCms').and.returnValue(Promise.resolve(story));

        cmsService
          .getStory('en/home', 'published', 'token')
          .then(storyResponse => {
            expect(storyResponse).toEqual(story);
            expect(cmsService.getFromCms).not.toHaveBeenCalled();
            expect(cache.get).toHaveBeenCalledWith('en/home', 'published');
          })
          .then(done, done.fail);
      });

      it('should get the story from the cms if it is the published version and it is not in the cache, and store into the cache afterwards', done => {
        spyOn(cache, 'store');
        spyOn(cmsService, 'getFromCms').and.returnValue(Promise.resolve(story));

        expect(cache.get('en/home', 'published')).toBeUndefined();

        cmsService
          .getStory('en/home', 'published', 'token')
          .then(storyResponse => {
            expect(storyResponse).toEqual(story);
            expect(cmsService.getFromCms).toHaveBeenCalledWith('en/home', 'published', 'token');
            expect(cache.store).toHaveBeenCalledWith(story, 'published');
          })
          .then(done, done.fail);
      });

      it('should not get the story from cache if it is the draft version of the story', done => {
        spyOn(cache, 'get');
        spyOn(cmsService, 'getFromCms').and.returnValue(Promise.resolve(story));

        cmsService
          .getStory('en/home', 'draft', 'token')
          .then(storyResponse => {
            expect(storyResponse).toEqual(story);
            expect(cmsService.getFromCms).toHaveBeenCalledWith('en/home', 'draft', 'token');
            expect(cache.get).not.toHaveBeenCalled();
          })
          .then(done, done.fail);
      });

      it('should not store into the cache if it is the draft version of the story', done => {
        spyOn(cache, 'store');
        spyOn(cmsService, 'getFromCms').and.returnValue(Promise.resolve(story));

        cmsService
          .getStory('en/home', 'draft', 'token')
          .then(storyResponse => {
            expect(storyResponse).toEqual(story);
            expect(cmsService.getFromCms).toHaveBeenCalledWith('en/home', 'draft', 'token');
            expect(cache.store).not.toHaveBeenCalled();
          })
          .then(done, done.fail);
      });

      it('should get a story from the CMS', done => {
        const slug = 'en/home';
        const version = 'draft';
        const token = '123456789';

        nock(cmsUrl)
          .get(`/${slug}`)
          .query({
            version,
            token,
          })
          .reply(200, {
            story,
          });

        cmsService
          .getFromCms(slug, version, token)
          .then(storyReturned => {
            expect(storyReturned).toEqual(story);
          })
          .then(done, done.fail);
      });
    });

    describe('cache', () => {
      it('should be enabled via config variable', done => {
        isCacheEnabled = true;
        cmsService = CmsService({ isCacheEnabled, cmsUrl, logger, cache });

        spyOn(cache, 'get');
        spyOn(cmsService, 'getFromCms').and.returnValue(Promise.resolve(story));

        cmsService
          .getStory('en/home', 'published', 'token')
          .then(() => {
            expect(cache.get).toHaveBeenCalled();
          })
          .then(done, done.fail);
      });

      it('should be disabled via config variable', done => {
        isCacheEnabled = false;
        cmsService = CmsService({ isCacheEnabled, cmsUrl, logger, cache });

        spyOn(cache, 'get');
        spyOn(cmsService, 'getFromCms').and.returnValue(Promise.resolve(story));

        cmsService
          .getStory('en/home', 'published', 'token')
          .then(() => {
            expect(cache.get).not.toHaveBeenCalled();
          })
          .then(done, done.fail);
      });
    });
  });
});
