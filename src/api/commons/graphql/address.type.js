const address = `
  type Address @cacheControl(maxAge: 0) {
    id: ID!
    key: String
    title: String
    salutation: String
    firstName: String
    lastName: String
    streetName: String
    streetNumber: String
    additionalStreetInfo: String
    postalCode: String
    city: String
    region: String
    state: String
    country: String!
    company: String
    department: String
    building: String
    pOBox: String
    phone: String
    mobile: String
    email: String
    fax: String
    additionalAddressInfo: String
    externalId: String
  }

  input AddressDraft {
    id: ID
    key: String
    title: String
    firstName: String!
    lastName: String!
    streetName: String!
    additionalStreetInfo: String
    city: String!
    region: String
    postalCode: String!
    country: String!
    isDefaultShipping: Boolean
    isDefaultBilling: Boolean
  }
`;

export default address;
