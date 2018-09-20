import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

const identity = value => value;

const getCommonDefinition = (name, description) => ({
  name,
  description,
  parseValue: identity,
  serialize: identity,
});

const getStringScalarType = (name, description) => {
  return new GraphQLScalarType({
    ...getCommonDefinition(name, description),
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }

      return null;
    },
  });
};

const getIntScalarType = (name, description) => {
  return new GraphQLScalarType({
    ...getCommonDefinition(name, description),
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }

      return null;
    },
  });
};

// Definition from https://github.com/taion/graphql-type-json/
const getJsonScalarType = (name, description) => {
  return new GraphQLScalarType({
    ...getCommonDefinition(name, description),
    parseLiteral(ast, variables) {
      switch (ast.kind) {
        case Kind.STRING:
        case Kind.BOOLEAN:
          return ast.value;
        case Kind.INT:
        case Kind.FLOAT:
          return parseFloat(ast.value);
        case Kind.OBJECT: {
          const value = Object.create(null);
          ast.fields.forEach(field => {
            value[field.name.value] = this.parseLiteral(field.value, variables);
          });

          return value;
        }
        case Kind.LIST:
          return ast.values.map(n => this.parseLiteral(n, variables));
        case Kind.NULL:
          return null;
        case Kind.VARIABLE: {
          const astname = ast.name.value;
          return variables ? variables[astname] : undefined;
        }
        default:
          return undefined;
      }
    },
  });
};

export default {
  Long: getIntScalarType('Long', 'Long custom scalar type'),
  DateTime: getStringScalarType('DateTime', 'DateTime custom scalar type'),
  Locale: getStringScalarType('Locale', 'Locale custom scalar type'),
  Currency: getStringScalarType('Currency', 'Currency custom scalar type'),
  Country: getStringScalarType('Country', 'Country custom scalar type'),
  Json: getJsonScalarType('Json', 'Raw Json scalar type'),
};
