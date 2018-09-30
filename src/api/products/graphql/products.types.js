import commons from '../../commons/graphql/types/commons.type';
import attributeDefinition from '../../commons/graphql/types/attribute-definition.type';
import state from '../../commons/graphql/types/state.type';
import taxCategory from '../../commons/graphql/types/tax-category.type';
import image from '../../commons/graphql/types/image.type';
import discount from '../../commons/graphql/types/discount.type';
import category from '../../categories/graphql/categories.types';

const productsSearch = `
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
    productIds: [String!]!
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
