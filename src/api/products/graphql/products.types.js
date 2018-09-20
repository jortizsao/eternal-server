import commons from '../../commons/graphql/types/commons.type';
import attributeDefinition from '../../commons/graphql/types/attribute-definition.type';
import state from '../../commons/graphql/types/state.type';
import taxCategory from '../../commons/graphql/types/tax-category.type';
import image from '../../commons/graphql/types/image.type';
import discount from '../../commons/graphql/types/discount.type';
import category from '../../categories/graphql/categories.types';

const productsSearch = `
  interface ProductType {
    productTypeId: String!
  }

  type ProductTypeDefinition implements Versioned {
    key: String
    name: String!
    description: String!
    attributeDefinitions(
      # The names of the attribute definitions to include.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all attribute definitions are returned.
      includeNames: [String!]

      # The names of the attribute definitions to exclude.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all attribute definitions are returned.
      excludeNames: [String!]
    ): [AttributeDefinition!]!
    id: String!
    version: Long!
    createdAt: DateTime!
    lastModifiedAt: DateTime!
  }

  type ProductPrice {
    id: String
    value: Money!
    country: Country
    customerGroup: Reference
    channel: Reference
    validFrom: DateTime
    validUntil: DateTime
    discounted: DiscountedProductPriceValue
  }

  type ProductVariant {
    id: Int!
    key: String
    sku: String
    prices: [ProductPrice!]

    # Returns a single price based on the price selection rules.
    price(currency: Currency!, country: Country, customerGroupId: String, channelId: String, date: DateTime): ProductPrice
    images: [Image!]!
    attributesRaw(
      # The names of the attributes to include.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all attributes are returned.
      includeNames: [String!]

      # The names of the attributes to exclude.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all attributes are returned.
      excludeNames: [String!]
    ): [RawProductAttribute!]! @deprecated(reason: "Do not use this field as it may be removed in the future")

    # Product attributes
    attributes: ProductType!

    # Product attributes are returned as a list instead of an object structure.
    attributeList(
      # The names of the attributes to include.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all attributes are returned.
      includeNames: [String!]

      # The names of the attributes to exclude.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all attributes are returned.
      excludeNames: [String!]
    ): [Attribute!]!
  }

  type ProductData {
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
    nameAllLocales: [LocalizedString!]!
    descriptionAllLocales: [LocalizedString!]
    slug(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale

      # List of languages the client is able to understand, and which locale variant is preferred.
      acceptLanguage: [Locale!]
    ): String
    categoryOrderHint(categoryId: String!): String
    categoryOrderHints: [CategoryOrderHint!]!
    categoriesRef: [Reference!]!
    categories: [Category!]!
    searchKeyword(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale!
    ): [SearchKeyword!]
    searchKeywords: [SearchKeywords!]!
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
    masterVariant: ProductVariant!
    variants: [ProductVariant!]!
    allVariants: [ProductVariant!]!
    variant(
      # Queries for a variant with specified SKU
      sku: String

      # Queries for a variant with specified [key](https://dev.commercetools.com/http-api-projects-products.html#variant_key)
      key: String
    ): ProductVariant
    skus: [String!]!
  }

  type ProductCatalogData {
    current: ProductData!
    staged: ProductData!
    published: Boolean!
    hasStagedChanges: Boolean!
  }

  
  
  type Product implements Versioned {
    id: String!
    key: String
    version: Long!
    productTypeRef: Reference!
    productType: ProductTypeDefinition
    masterData: ProductCatalogData!
    catalogData(id: String!): ProductCatalogData
    skus: [String!]!
    createdAt: DateTime!
    lastModifiedAt: DateTime!
    stateRef: Reference
    state: State
    taxCategoryRef: Reference
    taxCategory: TaxCategory
  }

  type FacetResult {
    term: String!
    count: Int!
    productCount: Int
  }

  type Facet {
    facet: String!
    total: Int
    dataType: String
    terms: [FacetResult!]
  }

  type ProductsSearchQueryResult {
    offset: Int!
    count: Int!
    total: Int!
    results: [Product!]
    facets: [Facet!]
  }

  input ProductSearchText {
    locale: String!,
    value: String!
  }

  type Query {
    productsSearch(
      text: ProductSearchText
      fuzzy: Boolean
      fuzzyLevel: Int
      facet: [String!]
      markMatchingVariants: Boolean
      filter: [String!]
      filterByQuery: [String!]
      filterByFacets: [String!]
      sort: [String!]
      limit: Int
      offset: Int
    ): ProductsSearchQueryResult!
  }
`;

export default () => [
  commons,
  attributeDefinition,
  state,
  taxCategory,
  category,
  image,
  discount,
  productsSearch,
];
