import { pipe, unset, pick, get, first } from 'lodash/fp';

export default ({ customersUtils, customersService, authorizeService }) => {
  function getCustomerResponse(customer) {
    return {
      customer,
      token: pipe(customersUtils.getTokenPayload, authorizeService.getAccessToken)(customer),
    };
  }

  return {
    signUp(req, res, next) {
      try {
        const validCustomer = customersUtils.getValidCustomerToRegister(
          pick(
            ['title', 'firstName', 'lastName', 'email', 'password', 'confirmPassword'],
            req.body,
          ),
        );

        return customersService
          .find({ where: `lowercaseEmail="${validCustomer.email.toLowerCase()}"` })
          .then(pipe(get('results'), first))
          .then(existingCustomer => {
            if (existingCustomer) {
              return res.status(400).send({ message: 'Email already registered' });
            }

            return customersService
              .signUp(validCustomer)
              .then(pipe(get('customer'), unset('password')))
              .then(customer => res.json(getCustomerResponse(customer)));
          })
          .catch(next);
      } catch (err) {
        return res.status(400).send({ message: err.message });
      }
    },

    signIn(req, res) {
      if (req.user) {
        const customer = unset('password', req.user);

        return res.json(getCustomerResponse(customer));
      } else {
        return res.sendStatus(401);
      }
    },
  };
};
