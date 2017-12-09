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
};
