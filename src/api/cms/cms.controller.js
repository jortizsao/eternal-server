export default ({ privateToken, publicToken, logger, cmsService }) => {
  const controller = {};

  controller.getStory = (req, res, next) => {
    logger.debug('Getting CMS story');
    const { token, version } = req.query;
    const slug = req.params[0];

    const configTokens = version === 'draft' ? [privateToken] : [privateToken, publicToken];

    if (!configTokens.some(configToken => configToken === token)) {
      logger.debug('Invalid CMS token');
      return res.sendStatus(401);
    }

    return cmsService
      .getStory(slug, version, token)
      .then(story => res.json(story))
      .catch(err => {
        if (!err.statusCode) {
          next(err);
        } else {
          res.sendStatus(err.statusCode);
        }
      });
  };

  controller.clearCache = (req, res, next) => {
    logger.debug('Clearing CMS cache');
    const { token } = req.query;

    try {
      if (token === privateToken) {
        cmsService.clearCache();
        logger.debug('CMS cache cleared');
        res.sendStatus(200);
      } else {
        logger.debug('Clear CMS cache forbidden');
        res.sendStatus(401);
      }
    } catch (e) {
      next(e);
    }
  };

  return controller;
};
