export default ({ router, container }) => {
  const cmsController = container.resolve('cmsController');

  router.get(/^\/stories\/(.+)/, cmsController.getStory);
  router.post('/clearCache', cmsController.clearCache);

  return router;
};
