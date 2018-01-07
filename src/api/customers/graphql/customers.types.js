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

  input CustomerDraft {
    email: String
    firstName: String
    lastName: String
    middleName: String
    title: String
    dateOfBirth: String
    companyName: String
    vatId: String
    externalId: String
    version: Int
  }

  type Query {
    customer(id: ID!): Customer
  }

  type Mutation {
    updateCustomer(id: ID!, customerDraft: CustomerDraft!): Customer
    changeCustomerPassword(id: ID!, currentPassword: String!, newPassword: String!) : Customer
    saveCustomerAddress(id: ID!, addressDraft: AddressDraft) : Customer
  }
`;

export default () => [Customer, Address];
