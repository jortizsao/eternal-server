export default function ({
  commercetools,
  customersSequence,
  customObjectsService,
  commonsService,
}) {
  const restCTClient = commercetools.restCTClient;

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
        .find({ filter: `key="${sequence}"` })
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
      return new Promise((resolve, reject) => {
        restCTClient.POST('/login', { email, password, anonymousCartId }, (err, res) => {
          if (err) {
            return reject(err);
          } else if (res.statusCode === 400) {
            return resolve();
          } else {
            return resolve(res.body.customer);
          }
        });
      });
    },

    ...commonsService,
  };
}
