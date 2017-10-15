import customersServiceModule from './customers.service';
import { ValidationError } from '../../errors';

export default app => {
  const controller = {};
  const utils = app.utils;
  const customersService = customersServiceModule(app);

  controller.hasAllRequiredFields = customer => {
    const requiredFields = [
      customer.firstName,
      customer.lastName,
      customer.email,
      customer.password,
      customer.confirmPassword,
    ];

    return requiredFields.every(field => !utils.commons.isStringEmpty(field));
  };

  controller.passwordAndConfirmPasswordMatch = customer => {
    return customer.password === customer.confirmPassword;
  };

  controller.getCleanCustomer = customer => {
    return {
      firstName: customer.firstName && customer.firstName.trim(),
      lastName: customer.lastName && customer.lastName.trim(),
      email: customer.email && customer.email.trim(),
      password: customer.password && customer.password.trim(),
      confirmPassword: customer.confirmPassword && customer.confirmPassword.trim(),
    };
  };

  controller.getValidCustomerToRegister = customer => {
    const cleanCustomer = controller.getCleanCustomer(customer);

    if (controller.hasAllRequiredFields(cleanCustomer)) {
      if (controller.passwordAndConfirmPasswordMatch(cleanCustomer)) {
        return cleanCustomer;
      } else {
        throw new ValidationError("Passwords fields don't match");
      }
    } else {
      throw new ValidationError('Please fill all required fields');
    }
  };

  controller.signUp = (req, res, next) => {
    try {
      const { firstName, lastName, email, password, confirmPassword } = req.body;
      const customer = {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      };
      const validCustomer = controller.getValidCustomerToRegister(customer);

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
              .then(customerCreatedNoPassword => res.json(customerCreatedNoPassword));
          }
        })
        .catch(next);
    } catch (err) {
      return res.status(400).send({ message: err.message });
    }
  };

  controller.signIn = (req, res) => {
    return res.json({
      customer: {
        ...req.user,
        password: undefined,
      },
    });
  };

  return controller;
};
