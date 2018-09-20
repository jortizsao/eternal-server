import commons from '../../commons/graphql/types/commons.type';

const category = `
  type CategoryOrderHint {
    categoryId: String!
    orderHint: String!
  }

  type Category implements Versioned {
    id: String!
    key: String
    version: Long!
    name(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale

      # List of languages the client is able to understand, and which locale variant is preferred.
      acceptLanguage: [Locale!]
    ): String
    description(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale

      # List of languages the client is able to understand, and which locale variant is preferred.
      acceptLanguage: [Locale!]
    ): String
    slug(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale

      # List of languages the client is able to understand, and which locale variant is preferred.
      acceptLanguage: [Locale!]
    ): String
    ancestorsRef: [Reference!]!
    ancestors: [Category!]!
    parentRef: Reference
    parent: Category
    orderHint: String!
    externalId: String
    metaTitle(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale

      # List of languages the client is able to understand, and which locale variant is preferred.
      acceptLanguage: [Locale!]
    ): String
    metaKeywords(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale

      # List of languages the client is able to understand, and which locale variant is preferred.
      acceptLanguage: [Locale!]
    ): String
    metaDescription(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale

      # List of languages the client is able to understand, and which locale variant is preferred.
      acceptLanguage: [Locale!]
    ): String

    # Number of a products in the category subtree.
    productCount: Int!

    # Number of direct child categories.
    childCount: Int!

    # Direct child categories.
    children: [Category!]
    createdAt: DateTime!
    lastModifiedAt: DateTime!
  }
`;

export default () => [commons, category];
