import app from '../../../server';
import cmsControllerModule from '../cms.controller';
import * as cmsServiceModule from '../cms.service';

describe('CMS', () => {
  describe('Controller', () => {
    let cmsController;
    let cmsService;
    const res = {
      json: () => {},
      sendStatus: () => {},
    };
    const next = jasmine.createSpy();

    beforeEach(() => {
      cmsService = {
        getStory: () => {},
        clearCache: () => {},
      };
      spyOn(res, 'json');
      spyOn(res, 'sendStatus');
      spyOn(cmsServiceModule, 'default').and.returnValue(cmsService);
      cmsController = cmsControllerModule(app);
    });

    describe('stories', () => {
      it('should not get a story if the token is not correct', () => {
        const req = {
          query: {
            version: 'published',
            token: 'notValidToken',
          },
          params: ['home'],
        };

        spyOn(cmsService, 'getStory');

        cmsController.getStory(req, res, next);

        expect(cmsService.getStory).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(401);
      });

      it('should not get the draft version of a story if using the public access token', () => {
        const req = {
          query: {
            version: 'draft',
            token: 'publicAccessToken', // This value has been set in the config test env
          },
          params: ['home'],
        };

        spyOn(cmsService, 'getStory');

        cmsController.getStory(req, res, next);

        expect(cmsService.getStory).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(401);
      });

      it('should get the draft version of a story if the private access token is correct', done => {
        const req = {
          query: {
            version: 'draft',
            token: 'privateAccessToken', // This value has been set in the config test env
          },
          params: ['en/home'],
        };

        const story = {
          id: 'id1',
          slug: 'home',
          full_slug: 'en/home',
        };

        spyOn(cmsService, 'getStory').and.returnValue(Promise.resolve(story));

        cmsController
          .getStory(req, res, next)
          .then(() => {
            expect(cmsService.getStory).toHaveBeenCalledWith(
              'en/home',
              'draft',
              'privateAccessToken',
            );
            expect(res.json).toHaveBeenCalledWith(story);
          })
          .then(done, done.fail);
      });

      it('should get the published version of a story if the private access token is correct', done => {
        const req = {
          query: {
            version: 'published',
            token: 'privateAccessToken', // This value has been set in the config test env
          },
          params: ['en/home'],
        };

        const story = {
          id: 'id1',
          slug: 'home',
          full_slug: 'en/home',
        };

        spyOn(cmsService, 'getStory').and.returnValue(Promise.resolve(story));

        cmsController
          .getStory(req, res, next)
          .then(() => {
            expect(cmsService.getStory).toHaveBeenCalledWith(
              'en/home',
              'published',
              'privateAccessToken',
            );
            expect(res.json).toHaveBeenCalledWith(story);
          })
          .then(done, done.fail);
      });

      it('should get the published version of a story if the public access token is correct', done => {
        const req = {
          query: {
            version: 'published',
            token: 'publicAccessToken', // This value has been set in the config test env
          },
          params: ['en/home'],
        };

        const story = {
          id: 'id1',
          slug: 'home',
          full_slug: 'en/home',
        };

        spyOn(cmsService, 'getStory').and.returnValue(Promise.resolve(story));

        cmsController
          .getStory(req, res, next)
          .then(() => {
            expect(cmsService.getStory).toHaveBeenCalledWith(
              'en/home',
              'published',
              'publicAccessToken',
            );
            expect(res.json).toHaveBeenCalledWith(story);
          })
          .then(done, done.fail);
      });

      it('should handle an error when getting the story from the CMS and return the original status code', done => {
        const req = {
          query: {
            version: 'published',
            token: 'publicAccessToken',
          },
          params: ['en/home'],
        };

        spyOn(cmsService, 'getStory').and.returnValue(
          Promise.reject({
            statusCode: 404,
            message: 'Not found',
          }),
        );

        cmsController
          .getStory(req, res, next)
          .then(() => {
            expect(res.sendStatus).toHaveBeenCalledWith(404);
          })
          .then(done, done.fail);
      });

      it('should handle unexpected errors when getting the story from the CMS', done => {
        const req = {
          query: {
            version: 'published',
            token: 'publicAccessToken',
          },
          params: ['en/home'],
        };

        spyOn(cmsService, 'getStory').and.returnValue(
          Promise.reject(new Error('Unexpected error')),
        );

        cmsController
          .getStory(req, res, next)
          .then(() => {
            expect(next).toHaveBeenCalledWith(new Error('Unexpected error'));
          })
          .then(done, done.fail);
      });
    });

    describe('cache', () => {
      it('should clear the cache using the private token', () => {
        const req = {
          query: {
            token: 'privateAccessToken', // This value has been set in the config test env
          },
        };

        spyOn(cmsService, 'clearCache');

        cmsController.clearCache(req, res, next);

        expect(cmsService.clearCache).toHaveBeenCalled();
      });

      it('should not clear the cache using the public token', () => {
        const req = {
          query: {
            token: 'publicAccessToken', // This value has been set in the config test env
          },
        };

        spyOn(cmsService, 'clearCache');

        cmsController.clearCache(req, res, next);

        expect(cmsService.clearCache).not.toHaveBeenCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(401);
      });

      it('should not clear the cache using an invalid token', () => {
        const req = {
          query: {
            token: 'invalidToken',
          },
        };

        spyOn(cmsService, 'clearCache');

        cmsController.clearCache(req, res, next);

        expect(cmsService.clearCache).not.toHaveBeenCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(401);
      });

      it('should handle unexpected errors when clearing the cache', () => {
        const req = {
          query: {
            token: 'privateAccessToken', // This value has been set in the config test env
          },
        };

        spyOn(cmsService, 'clearCache').and.throwError(new Error('Unexpected error'));

        cmsController.clearCache(req, res, next);
        expect(next).toHaveBeenCalledWith(new Error('Unexpected error'));
      });
    });
  });

  describe('Service', () => {
    let cmsService;
    let story;

    beforeEach(() => {
      cmsService = cmsServiceModule.default(app);
      cmsService.clearCache();
      story = {
        id: 'id1',
        slug: 'home',
        full_slug: 'en/home',
      };
      spyOn(cmsService, 'getFromCms').and.returnValue(Promise.resolve(story));
    });

    describe('stories', () => {
      it('should store a story into the cache', () => {
        cmsService.storeInCache(story, 'published');

        expect(cmsService.getCache()).toEqual({
          'en/home': {
            published: {
              id: 'id1',
              slug: 'home',
              full_slug: 'en/home',
            },
          },
        });
      });

      it('should return the story from cache if exists and it is the published version', done => {
        spyOn(cmsService, 'getFromCache').and.callThrough();

        cmsService.storeInCache(story, 'published');

        cmsService
          .getStory('en/home', 'published', 'token')
          .then(storyResponse => {
            expect(storyResponse).toEqual(story);
            expect(cmsService.getFromCms).not.toHaveBeenCalled();
            expect(cmsService.getFromCache).toHaveBeenCalledWith('en/home', 'published');
          })
          .then(done, done.fail);
      });

      it('should get the story from the cms if it is the published version and it is not in the cache, and store into the cache afterwards', done => {
        spyOn(cmsService, 'storeInCache');

        expect(cmsService.getFromCache('en/home', 'published')).toBeUndefined();

        cmsService
          .getStory('en/home', 'published', 'token')
          .then(storyResponse => {
            expect(storyResponse).toEqual(story);
            expect(cmsService.getFromCms).toHaveBeenCalledWith('en/home', 'published', 'token');
            expect(cmsService.storeInCache).toHaveBeenCalledWith(story, 'published');
          })
          .then(done, done.fail);
      });

      it('should not get the story from cache if it is the draft version of the story', done => {
        spyOn(cmsService, 'getFromCache');

        cmsService
          .getStory('en/home', 'draft', 'token')
          .then(storyResponse => {
            expect(storyResponse).toEqual(story);
            expect(cmsService.getFromCms).toHaveBeenCalledWith('en/home', 'draft', 'token');
            expect(cmsService.getFromCache).not.toHaveBeenCalled();
          })
          .then(done, done.fail);
      });

      it('should not store into the cache if it is the draft version of the story', done => {
        spyOn(cmsService, 'storeInCache');

        cmsService
          .getStory('en/home', 'draft', 'token')
          .then(storyResponse => {
            expect(storyResponse).toEqual(story);
            expect(cmsService.getFromCms).toHaveBeenCalledWith('en/home', 'draft', 'token');
            expect(cmsService.storeInCache).not.toHaveBeenCalled();
          })
          .then(done, done.fail);
      });
    });

    describe('cache', () => {
      it('should be enabled via config variable', done => {
        const configGetSpy = spyOn(app.config, 'get');

        configGetSpy.and.callFake(configVariable => {
          if (configVariable === 'CMS:CACHE_ENABLED') {
            return true;
          } else {
            // if the varialbe is not the one we are interested we use the original function
            configGetSpy.and.callThrough();
            return app.config.get(configVariable);
          }
        });

        spyOn(cmsService, 'getFromCache');

        cmsService
          .getStory('en/home', 'published', 'token')
          .then(() => {
            expect(cmsService.getFromCache).toHaveBeenCalled();
          })
          .then(done, done.fail);
      });

      it('should be disabled via config variable', done => {
        const configGetSpy = spyOn(app.config, 'get');

        configGetSpy.and.callFake(configVariable => {
          if (configVariable === 'CMS:CACHE_ENABLED') {
            return false;
          } else {
            // if the varialbe is not the one we are interested we use the original function
            configGetSpy.and.callThrough();
            return app.config.get(configVariable);
          }
        });

        spyOn(cmsService, 'getFromCache');

        cmsService
          .getStory('en/home', 'published', 'token')
          .then(() => {
            expect(cmsService.getFromCache).not.toHaveBeenCalled();
          })
          .then(done, done.fail);
      });
    });
  });
});
