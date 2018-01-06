function getAddressById(addresses, id) {
  return addresses.find(address => address.id === id);
}

function getAddresses(addresses, addressesId) {
  return addresses.filter(address => addressesId.includes(address.id));
}

export default {
  Query: {
    customer(root, { id }, { customersService, authUser }) {
      return customersService.byId({ id, authUser });
    },
  },
  Customer: {
    defaultShippingAddress({ addresses, defaultShippingAddressId }) {
      return getAddressById(addresses, defaultShippingAddressId);
    },

    defaultBillingAddress({ addresses, defaultBillingAddressId }) {
      return getAddressById(addresses, defaultBillingAddressId);
    },

    shippingAddresses({ addresses, shippingAddressIds }) {
      return getAddresses(addresses, shippingAddressIds);
    },

    billingAddresses({ addresses, billingAddressIds }) {
      return getAddresses(addresses, billingAddressIds);
    },
  },
  Mutation: {
    updateCustomer(root, { id, customerDraft }, { customersService, authUser }) {
      return customersService.update({ id, customerDraft, authUser });
    },

    changeCustomerPassword(
      root,
      { id, currentPassword, newPassword },
      { customersService, authUser },
    ) {
      return customersService.changePassword(id, currentPassword, newPassword, { authUser });
    },

    addCustomerAddress(root, { id, addressDraft }, { customersService, authUser }) {
      return customersService.addAddress(id, addressDraft, { authUser });
    },
  },
};
