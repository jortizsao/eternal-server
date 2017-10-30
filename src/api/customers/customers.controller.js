export default ({ customersUtils, customersService }) => {
  return {
    signUp(req, res, next) {
      try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;
        const customer = {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        };
        const validCustomer = customersUtils.getValidCustomerToRegister(customer);

        return customersService
          .find({
            filter: `lowercaseEmail="${validCustomer.email.toLowerCase()}"`,
          })
          .then(({ results }) => results[0])
          .then(existingCustomer => {
            if (existingCustomer) {
              return res.status(400).send({ message: 'Email already registered' });
            } else {
              return customersService
                .signUp(validCustomer)
                .then(customerCreated => ({
                  ...customerCreated.customer,
                  password: undefined,
                }))
                .then(customerCreatedNoPassword =>
                  res.json({
                    customer: customerCreatedNoPassword,
                  }),
                );
            }
          })
          .catch(next);
      } catch (err) {
        return res.status(400).send({ message: err.message });
      }
    },

    signIn(req, res) {
      if (req.user) {
        return res.json({
          customer: {
            ...req.user,
            password: undefined,
          },
        });
      } else {
        return res.sendStatus(401);
      }
    },
  };
};
