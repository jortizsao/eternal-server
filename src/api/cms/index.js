export default ({ router, cmsController }) => {
  router.get(/^\/stories\/(.+)/, cmsController.getStory);
  router.post('/clearCache', cmsController.clearCache);

  return router;
};
