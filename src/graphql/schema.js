import { mergeSchemas, WrapQuery } from 'graphql-tools';
import { Kind } from 'graphql';

const productLinkTypeDefs = `
  extend type ProductsSearchQueryResult {
    results: [Product!]!
  }
`;

export default ({ commercetoolsSchema, customersSchema, productsSchema }) =>
  mergeSchemas({
    schemas: [customersSchema, commercetoolsSchema, productsSchema, productLinkTypeDefs],
    resolvers: {
      ProductsSearchQueryResult: {
        results: {
          fragment: '... on ProductsSearchQueryResult { productIds }',
          resolve(productsSearchQueryResult, args, context, info) {
            const { productIds } = productsSearchQueryResult;
            if (!productIds.length) {
              return [];
            }

            return info.mergeInfo.delegateToSchema({
              schema: commercetoolsSchema,
              operation: 'query',
              fieldName: 'products',
              args: {
                where: `id in (${productIds.map(id => `"${id}"`).join(',')})`,
              },
              context,
              info,
              transforms: [
                new WrapQuery(
                  ['products'],
                  subtree => ({
                    kind: Kind.FIELD,
                    name: {
                      kind: Kind.NAME,
                      value: 'results',
                    },
                    selectionSet: subtree,
                  }),
                  productQueryResult => productQueryResult.results,
                ),
              ],
            });
          },
        },
      },
    },
  });
