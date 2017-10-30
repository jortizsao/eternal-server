export default ({ router, container }) => {
  const customersController = container.resolve('customersController');
  const authMiddleware = container.resolve('authMiddleware');

  router.post('/signUp', customersController.signUp);
  router.post('/signIn', authMiddleware, customersController.signIn);

  return router;
};
