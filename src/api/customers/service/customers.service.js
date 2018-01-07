import { ValidationError } from '../../../errors';

export default function ({
  commercetools,
  customersSequence,
  customObjectsService,
  commonsService,
  syncCustomers,
  utils,
}) {
  const service = {};
  const ctClient = commercetools.client;
  const ctRequestBuilder = commercetools.requestBuilder;

  const checkChangePasswordRequiredFields = (currentPassword, newPassword) => {
    if (utils.commons.isStringEmpty(currentPassword)) {
      throw new ValidationError('"current password" is required');
    }

    if (utils.commons.isStringEmpty(newPassword)) {
      throw new ValidationError('"new password" is required');
    }
  };

  service.setCustomerNumber = ({ sequence, value, version }) =>
    customObjectsService
      .save({
        container: sequence,
        key: sequence,
        value,
        version,
      })
      .then(customObject => customObject.value);

  service.getCustomerNumber = sequence =>
    customObjectsService
      .find({ where: `key="${sequence}"` })
      .then(({ results }) => (results.length > 0 ? results[0] : { value: 0 }))
      .then(lastValue => {
        return service
          .setCustomerNumber({
            sequence,
            value: lastValue.value + 1,
            version: lastValue.version,
          })
          .catch(() => service.getCustomerNumber(sequence)); // We request a new one on error
      });

  service.getCustomerVersion = (id, version) =>
    Promise.resolve().then(() => version || service.byId(id).then(customer => customer.version));

  service.signUp = customer =>
    service
      .getCustomerNumber(customersSequence)
      .then(customerNumber => ({ ...customer, customerNumber: customerNumber.toString() }))
      .then(utils.commons.fieldsToLowerCase)
      .then(commonsService.save);

  service.signIn = (email, password, anonymousCartId) =>
    ctClient
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

  service.update = (id, customerDraft, options = {}) =>
    service.byId(id).then(oldCustomer => {
      const newCustomer = {
        ...oldCustomer,
        ...utils.commons.fieldsToLowerCase(customerDraft),
      };
      const actions = syncCustomers.buildActions(newCustomer, oldCustomer);

      return commonsService.update({
        id: oldCustomer.id,
        actions,
        version: options.version || oldCustomer.version,
      });
    });

  service.byId = id => commonsService.byId(id);

  service.find = ({ where, page, perPage, sortBy, sortAscending, expand, authUser }) => {
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
  };

  service.changePassword = (id, currentPassword, newPassword, options = {}) =>
    Promise.resolve()
      .then(() => checkChangePasswordRequiredFields(currentPassword, newPassword))
      .then(() => service.getCustomerVersion(id, options.version))
      .then(customerVersion =>
        ctClient.execute({
          uri: `${ctRequestBuilder.customers.build()}/password`,
          method: 'POST',
          body: { id, version: customerVersion, currentPassword, newPassword },
        }),
      )
      .then(res => res.body);

  service.addAddress = (id, address, options = {}) =>
    Promise.resolve()
      .then(() => utils.commons.checkIfAddressHasRequiredFields(address))
      .then(() => service.getCustomerVersion(id, options.version))
      .then(customerVersion =>
        ctClient.execute({
          uri: `${ctRequestBuilder.customers.build()}/${id}`,
          method: 'POST',
          body: {
            version: customerVersion,
            actions: [
              {
                action: 'addAddress',
                address,
              },
            ],
          },
        }),
      )
      .then(res => res.body);

  return service;
}
