import CmsController from '../cms.controller';
import Config from '../../../config';
import Logger from '../../../logger';
import { httpResponse as res } from '../../../../spec/helpers/mocks';

describe('CMS', () => {
  describe('Controller', () => {
    const config = Config();
    const logger = Logger({ config });
    const cmsService = {
      getStory: () => {},
      clearCache: () => {},
    };
    const cmsController = CmsController({ config, logger, cmsService });
    let next;

    beforeEach(() => {
      spyOn(res, 'json');
      spyOn(res, 'sendStatus');
      next = jasmine.createSpy();
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
});
