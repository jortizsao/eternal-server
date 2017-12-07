function getAddressById(addresses, id) {
  return addresses.find(address => address.id === id);
}

function getAddresses(addresses, addressesId) {
  return addresses.filter(address => addressesId.includes(address.id));
}

export default {
  Query: {
    customer(root, { id }, { customersService }) {
      return customersService.byId(id);
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
    updateCustomer(root, { id, customerDraft }, { customersService }) {
      return customersService.updateCustomer({ id, customerDraft });
    },
  },
};
