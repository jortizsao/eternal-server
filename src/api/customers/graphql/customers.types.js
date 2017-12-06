import Address from '../../commons/graphql/address.type';

const Customer = `
  type Customer {
    id: ID!
    customerNumber: String
    email: String
    firstName: String
    lastName: String
    middleName: String
    title: String
    dateOfBirth: String
    companyName: String
    vatId: String
    addresses: [Address]!
    defaultShippingAddressId: String
    shippingAddressIds: [String]!
    defaultBillingAddressId: String
    billingAddressIds: [String]!
    defaultShippingAddress: Address
    defaultBillingAddress: Address
    shippingAddresses: [Address]!
    billingAddresses: [Address]!
    isEmailVerified: Boolean
    externalId: String
  }

  type Query {
    customer(id: ID!): Customer
  }
`;

export default () => [Customer, Address];
