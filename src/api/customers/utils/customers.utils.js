import { pick } from 'lodash/fp';
import { ValidationError } from '../../../errors';

export default ({ utils }) => {
  return {
    hasAllRequiredFields(customer) {
      const requiredFields = [
        customer.firstName,
        customer.lastName,
        customer.email,
        customer.password,
        customer.confirmPassword,
      ];

      return requiredFields.every(field => !utils.commons.isStringEmpty(field));
    },

    passwordAndConfirmPasswordMatch(customer) {
      return customer.password === customer.confirmPassword;
    },

    getCleanedCustomer(customer) {
      return {
        title: customer.title ? customer.title.trim() : '',
        firstName: customer.firstName && customer.firstName.trim(),
        lastName: customer.lastName && customer.lastName.trim(),
        email: customer.email && customer.email.trim(),
        password: customer.password && customer.password.trim(),
        confirmPassword: customer.confirmPassword && customer.confirmPassword.trim(),
      };
    },

    getValidCustomerToRegister(customer) {
      const cleanedCustomer = this.getCleanedCustomer(customer);

      if (this.hasAllRequiredFields(cleanedCustomer)) {
        if (this.passwordAndConfirmPasswordMatch(cleanedCustomer)) {
          return cleanedCustomer;
        } else {
          throw new ValidationError("Passwords fields don't match");
        }
      } else {
        throw new ValidationError('Please fill all required fields');
      }
    },

    getTokenPayload(customer) {
      return pick(['id', 'email'], customer);
    },
  };
};
