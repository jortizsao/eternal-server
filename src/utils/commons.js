import { NotAuthorizedError, NotAuthenticatedError } from '../errors';

export default {
  isStringEmpty(value) {
    return !value || value.length === 0;
  },

  fieldsToLowerCase(object) {
    return Object.keys(object).reduce((objectLowerCase, key) => {
      if (typeof object[key] === 'string') {
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
};
