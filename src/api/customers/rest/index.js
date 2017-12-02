export default ({ router, customersController, authenticateMiddleware }) => {
  router.post('/signUp', customersController.signUp);
  router.post('/signIn', authenticateMiddleware, customersController.signIn);

  return router;
};
