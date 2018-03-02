import { mergeSchemas } from 'graphql-tools';

export default ({ commercetoolsSchema, customersSchema }) =>
  mergeSchemas({
    schemas: [customersSchema, commercetoolsSchema],
  });
