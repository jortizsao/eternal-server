import { NotAuthorizedError, NotAuthenticatedError, ValidationError } from '../errors';

export default {
  isStringEmpty(value) {
    return !value || value.length === 0;
  },

  fieldsToLowerCase(object, options = { skip: [] }) {
    return Object.keys(object).reduce((objectLowerCase, key) => {
      if (typeof object[key] === 'string' && options.skip.indexOf(key) === -1) {
        objectLowerCase[key] = object[key].toLowerCase();
      } else {
        objectLowerCase[key] = object[key];
      }

      return objectLowerCase;
    }, {});
  },

  checkIfUserAuthorized(customerId, authUser) {
    if (!authUser.isAdmin && customerId !== authUser.id) {
      throw new NotAuthorizedError();
    }
  },

  checkIfUserAuthenticated(authUser) {
    if (!authUser) {
      throw new NotAuthenticatedError();
    }
  },

  checkRequiredFields(object, requiredFields) {
    requiredFields.forEach(field => {
      if (this.isStringEmpty(object[field])) {
        throw new ValidationError(`"${field}" is required`);
      }
    });
  },

  checkIfAddressHasRequiredFields(address) {
    const requiredFields = ['firstName', 'lastName', 'streetName', 'city', 'postalCode', 'country'];

    this.checkRequiredFields(address, requiredFields);
  },
};
