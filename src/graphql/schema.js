import { mergeSchemas } from 'graphql-tools';
import customersSchema from '../api/customers/graphql/customers.schema';

export default mergeSchemas({
  schemas: [customersSchema],
});
