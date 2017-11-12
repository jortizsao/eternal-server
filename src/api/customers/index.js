export default ({ router, container }) => {
  const customersController = container.resolve('customersController');
  const authenticateMiddleware = container.resolve('authenticateMiddleware');

  router.post('/signUp', customersController.signUp);
  router.post('/signIn', authenticateMiddleware, customersController.signIn);

  return router;
};
