import { Router } from 'express';
import cmsController from './cms.controller';

export default app => {
  const router = new Router();
  const controller = cmsController(app);

  router.get(/^\/stories\/(.+)/, controller.getStory);
  router.post('/clearCache', controller.clearCache);

  return router;
};
