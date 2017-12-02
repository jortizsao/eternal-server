import Address from '../../commons/graphql/address.type';

const Customer = `
  type Customer {
    id: ID!
    customerNumber: String
    email: String
    firstName: String
    lastName: String
    defaultShippingAddress: Address
    defaultBillingAddress: Address
    addresses: [Address]!
    shippingAddresses: [Address]!
    billingAddresses: [Address]!
  }

  type Query {
    customer(id: ID!): Customer
  }
`;

export default () => [Customer, Address];
