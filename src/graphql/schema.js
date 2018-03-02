import { mergeSchemas } from 'graphql-tools';
// import customersSchema from '../api/customers/graphql/customers.schema';
// import commercetoolsSchema from './commercetools/commercetools.schema';

export default ({ commercetoolsSchema, customersSchema }) =>
  mergeSchemas({
    schemas: [customersSchema, commercetoolsSchema],
  });
