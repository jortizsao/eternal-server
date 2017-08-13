export default app => {
  const service = {};
  const ctClient = app.ctClient;
  const restCTClient = app.restCTClient;
  const config = app.config;
  const customersSequence = config.get('COMMERCE_TOOLS:SEQUENCES:CUSTOMERS');

  function getCustomerNumber(sequence) {
    return ctClient.customObjects
      .where(`key="${customersSequence}"`)
      .fetch()
      .then(res => res.body.results)
      .then(results => (results.length > 0 ? results[0] : { value: 1 }))
      .then(lastValue => ({
        value: lastValue.value + 1,
        version: lastValue.version,
      }))
      .then(newValue => {
        return ctClient.customObjects
          .save({
            container: sequence,
            key: sequence,
            value: newValue.value,
            version: newValue.version,
          })
          .then(res => res.body.value)
          .catch(() => getCustomerNumber(sequence));
      });
  }

  service.find = params => {
    const { filter, page, perPage, all, sortBy, sortAscending } = params;
    let customersClient = ctClient.customers;

    if (all) {
      customersClient = customersClient.all();
    } else {
      // Bug in CT SDK if you get 'all()' then you can't sort, otherwise you will
      // get repeated results
      customersClient = sortBy
        ? customersClient.sort(sortBy, sortAscending)
        : customersClient;
      customersClient = page ? customersClient.page(page) : customersClient;
      customersClient = perPage
        ? customersClient.perPage(page)
        : customersClient;
    }
    return customersClient
      .where(filter)
      .fetch()
      .then(res => ({ results: res.body.results, total: res.body.total }));
  };

  service.signUp = customer => {
    return getCustomerNumber(customersSequence)
      .then(customerNumber => ({
        ...customer,
        customerNumber: customerNumber.toString(),
      }))
      .then(customerToSave =>
        ctClient.customers.save(customerToSave).then(res => res.body),
      );
  };

  service.signIn = (email, password, anonymousCartId) => {
    return new Promise((resolve, reject) => {
      restCTClient.POST(
        '/login',
        { email, password, anonymousCartId },
        (err, res) => {
          if (err) {
            return reject(err);
          } else if (res.statusCode === 400) {
            return resolve();
          } else {
            return resolve(res.body.customer);
          }
        },
      );
    });
  };

  return service;
};
