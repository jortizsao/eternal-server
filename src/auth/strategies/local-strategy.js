import passport from 'passport';
import { Strategy } from 'passport-local';
import customersServiceModule from '../../api/customers/customers.service';
import utilsModule from '../../utils';

export default app => {
  const customersService = customersServiceModule(app);
  const utils = utilsModule(app);

  passport.use(
    new Strategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        session: false,
      },
      (email, password, done) => {
        if (
          utils.commons.isStringEmpty(email) ||
          utils.commons.isStringEmpty(password)
        ) {
          return done(null, false);
        } else {
          customersService
            .signIn(email, password)
            .then(customer => done(null, customer || false))
            .catch(err => done(err));
        }
      },
    ),
  );
};
