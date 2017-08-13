import passport from 'passport';
import localStrategyModule from '../strategies/local-strategy';

export default app => {
  localStrategyModule(app); // Loading the local-strategy

  return (req, res, next) => {
    passport.authenticate('local', (err, user) => {
      if (err) {
        return next(err);
      }

      if (user) {
        req.user = user;
        return next();
      } else {
        return res.sendStatus(401);
      }
    })(req, res, next);
  };
};
