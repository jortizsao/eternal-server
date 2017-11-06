import { pipe, unset, pick, get, first } from 'lodash/fp';

export default ({ customersUtils, customersService }) => {
  return {
    signUp: (req, res, next) => {
      try {
        const validCustomer = customersUtils.getValidCustomerToRegister(
          pick(['firstName', 'lastName', 'email', 'password', 'confirmPassword'], req.body),
        );

        return customersService
          .find({ filter: `lowercaseEmail="${validCustomer.email.toLowerCase()}"` })
          .then(pipe(get('results'), first))
          .then(existingCustomer => {
            if (existingCustomer) {
              return res.status(400).send({ message: 'Email already registered' });
            }

            return customersService
              .signUp(validCustomer)
              .then(unset('customer.password'))
              .then(customer => res.json(customer));
          })
          .catch(next);
      } catch (err) {
        return res.status(400).send({ message: err.message });
      }
    },

    signIn(req, res) {
      return req.user ? res.json({ customer: unset('password', req.user) }) : res.sendStatus(401);
    },
  };
};
