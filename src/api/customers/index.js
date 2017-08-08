import { Router } from 'express';
import customersController from './customers.controller';

export default (app) => {
  const router = new Router();
  const controller = customersController(app);

  router.post('/signUp', controller.signUp);

  return router;
};
