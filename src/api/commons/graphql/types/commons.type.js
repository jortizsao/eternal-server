const commons = `
  # The "Long" scalar type represents non-fractional signed whole numeric values.
  # Long can represent values between -(2^63) and 2^63 - 1.
  scalar Long

  # DateTime is a scalar value that represents an ISO8601 formatted date and time.
  scalar DateTime

  # Locale is a scalar value represented as a string language tag.
  scalar Locale

  # Represents a currency. Currencies are identified by their [ISO
  # 4217](http://www.iso.org/iso/home/standards/currency_codes.htm) currency codes.
  scalar Currency

  # [ISO 3166-1](http://en.wikipedia.org/wiki/ISO_3166-1) country code.
  scalar Country

  # Raw JSON value
  scalar Json

  # Versioned object have an ID and version and modification. Every update of this object changes it's version.
  interface Versioned {
    id: String!
    version: Long!
    createdAt: DateTime!
    lastModifiedAt: DateTime!
  }

  type Reference {
    typeId: String!
    id: String!
  }

  type LocalizedString {
    locale: Locale!
    value: String!
  }

  type SearchKeyword {
    text: String!
  }

  type SearchKeywords {
    locale: Locale!
    searchKeywords: [SearchKeyword!]!
  }

  type Money {
    currencyCode: Currency!
    centAmount: Long!
  }
`;

export default () => [commons];
