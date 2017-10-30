import { Strategy } from 'passport-local';

export default ({ utils, customersService }) => {
  return new Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    (email, password, done) => {
      if (utils.commons.isStringEmpty(email) || utils.commons.isStringEmpty(password)) {
        return done(null, false);
      } else {
        customersService
          .signIn(email, password)
          .then(customer => done(null, customer))
          .catch(err => done(err));
      }
    },
  );
};
