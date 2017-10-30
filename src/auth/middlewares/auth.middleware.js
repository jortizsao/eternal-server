import passport from 'passport';

export default ({ authStrategies }) => {
  authStrategies.forEach(strategy => passport.use(strategy));

  return (req, res, next) => {
    passport.authenticate('local', (err, user) => {
      if (err) {
        return next(err);
      }

      req.user = user;
      return next();
    })(req, res, next);
  };
};
