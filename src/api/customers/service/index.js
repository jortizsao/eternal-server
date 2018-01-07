import CustomersService from './customers.service';

export default ({
  commercetools,
  customersSequence,
  customObjectsService,
  commonsService,
  syncCustomers,
  utils,
}) => {
  const customersService = CustomersService({
    commercetools,
    customersSequence,
    customObjectsService,
    commonsService,
    syncCustomers,
    utils,
  });

  const secured = cb => (...args) => {
    const id = args[0];
    const { authUser } = args[args.length - 1];

    return Promise.resolve()
      .then(() => {
        utils.commons.checkIfUserAuthenticated(authUser);
        utils.commons.checkIfUserAuthorized(id, authUser);
      })
      .then(() => cb(...args));
  };

  return {
    signUp: customersService.signUp,
    signIn: customersService.signIn,
    find: customersService.find,
    byId: secured(customersService.byId),
    update: secured(customersService.update),
    changePassword: secured(customersService.changePassword),
    saveAddress: secured(customersService.saveAddress),
  };
};
