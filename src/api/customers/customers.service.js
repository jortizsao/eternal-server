export default function ({
  commercetools,
  customersSequence,
  customObjectsService,
  commonsService,
  syncCustomers,
}) {
  const ctClient = commercetools.client;
  const ctRequestBuilder = commercetools.requestBuilder;

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
        .then(this.save);
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

    updateCustomer({ id, customerDraft }) {
      return this.byId(id).then(oldCustomer => {
        const newCustomer = {
          ...oldCustomer,
          ...customerDraft,
        };
        const actions = syncCustomers.buildActions(newCustomer, oldCustomer);

        return this.update({
          id: oldCustomer.id,
          actions,
          version: oldCustomer.version,
        });
      });
    },

    ...commonsService,
  };
}
