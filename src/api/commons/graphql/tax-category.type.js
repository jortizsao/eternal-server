import commons from './commons.type';

const taxCategory = `
  type SubRate {
    name: String!
    amount: Float!
  }

  type TaxRate {
    name: String!
    amount: Float!
    includedInPrice: Boolean!
    country: Country!
    state: String
    id: String
    subRates: [SubRate!]!
  }

  # Tax Categories define how products are to be taxed in different countries.
  type TaxCategory {
    id: String!
    version: Long!
    name: String!
    description: String
    rates: [TaxRate!]!
    createdAt: DateTime!
    lastModifiedAt: DateTime!
    key: String
  }
`;

export default () => [commons, taxCategory];
