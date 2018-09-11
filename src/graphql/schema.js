import { mergeSchemas } from 'graphql-tools';

export default ({ commercetoolsSchema, customersSchema, productsSchema }) =>
  mergeSchemas({
    schemas: [customersSchema, commercetoolsSchema, productsSchema],
  });
