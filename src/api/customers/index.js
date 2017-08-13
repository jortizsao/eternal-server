import { Router } from 'express';
import customersController from './customers.controller';
import authMiddlewareModule from '../../auth/middlewares/auth.middleware';

export default app => {
  const router = new Router();
  const controller = customersController(app);
  const authMiddleware = authMiddlewareModule(app);

  router.post('/signUp', controller.signUp);
  router.post('/signIn', authMiddleware, controller.signIn);

  return router;
};
