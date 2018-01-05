import { ValidationError } from '../../errors';

export default function ({
  commercetools,
  customersSequence,
  customObjectsService,
  commonsService,
  syncCustomers,
  utils,
}) {
  const ctClient = commercetools.client;
  const ctRequestBuilder = commercetools.requestBuilder;

  function checkChangePasswordRequiredFields(currentPassword, newPassword) {
    if (utils.commons.isStringEmpty(currentPassword)) {
      throw new ValidationError('"current password" is required');
    }

    if (utils.commons.isStringEmpty(newPassword)) {
      throw new ValidationError('"new password" is required');
    }
  }

  return {
    setCustomerNumber({ sequence, value, version }) {
      return customObjectsService
        .save({
          container: sequence,
          key: sequence,
          value,
          version,
        })
        .then(customObject => customObject.value);
    },

    getCustomerNumber(sequence) {
      return customObjectsService
        .find({ where: `key="${sequence}"` })
        .then(({ results }) => (results.length > 0 ? results[0] : { value: 0 }))
        .then(lastValue => {
          return this.setCustomerNumber({
            sequence,
            value: lastValue.value + 1,
            version: lastValue.version,
          }).catch(() => this.getCustomerNumber(sequence)); // We request a new one on error
        });
    },

    signUp(customer) {
      return this.getCustomerNumber(customersSequence)
        .then(customerNumber => ({ ...customer, customerNumber: customerNumber.toString() }))
        .then(utils.commons.fieldsToLowerCase)
        .then(commonsService.save);
    },

    signIn(email, password, anonymousCartId) {
      return ctClient
        .execute({
          uri: `${ctRequestBuilder.project.build()}login`,
          method: 'POST',
          body: { email, password, anonymousCartId },
        })
        .then(res => res.body.customer)
        .catch(err => {
          if (err.statusCode === 400) {
            return;
          }
          throw new Error(err);
        });
    },

    update({ id, customerDraft, authUser }) {
      return this.byId({ id, authUser }).then(oldCustomer => {
        const newCustomer = {
          ...oldCustomer,
          ...utils.commons.fieldsToLowerCase(customerDraft),
        };
        const actions = syncCustomers.buildActions(newCustomer, oldCustomer);

        return commonsService.update({
          id: oldCustomer.id,
          actions,
          version: oldCustomer.version,
        });
      });
    },

    byId({ id, authUser }) {
      return Promise.resolve()
        .then(() => {
          utils.commons.checkIfUserAuthenticated(authUser);
          utils.commons.checkIfUserAuthorized(id, authUser);
        })
        .then(() => commonsService.byId(id));
    },

    find({ where, page, perPage, sortBy, sortAscending, expand, authUser }) {
      if (authUser) {
        if (authUser.isAdmin) {
          return commonsService.find({ where, page, perPage, sortBy, sortAscending, expand });
        } else {
          return commonsService.find({
            where: `${where} and id="${authUser.id}"`,
            page,
            perPage,
            sortBy,
            sortAscending,
            expand,
          });
        }
      } else {
        return Promise.reject(new Error('Not authorized'));
      }
    },

    changePassword(id, currentPassword, newPassword, { authUser, version }) {
      return Promise.resolve()
        .then(() => {
          checkChangePasswordRequiredFields(currentPassword, newPassword);
          utils.commons.checkIfUserAuthenticated(authUser);
          utils.commons.checkIfUserAuthorized(id, authUser);
        })
        .then(() => {
          if (version) {
            return version;
          }

          return this.byId({ id, authUser }).then(customer => customer.version);
        })
        .then(customerVersion => {
          return ctClient.execute({
            uri: `${ctRequestBuilder.customers.build()}/password`,
            method: 'POST',
            body: { id, version: customerVersion, currentPassword, newPassword },
          });
        })
        .then(res => res.body);
    },
  };
}
