import commons from './commons.type';

const attributeDefinition = `
  interface Attribute {
    name: String!
  }

  interface AttributeDefinitionType {
    name: String!
  }

  enum AttributeConstraint {
    # No constraints are applied to the attribute
    None

    # Attribute value should be different in each variant
    Unique

    # A set of attributes, that have this constraint, should have different combinations in each variant
    CombinationUnique

    # Attribute value should be the same in all variants
    SameForAll
  }

  enum TextInputHint {
    SingleLine
    MultiLine
  }

  type RawProductAttribute {
    name: String!
    value: Json!
    attributeDefinition: AttributeDefinition
  }

  type AttributeDefinition {
    type: AttributeDefinitionType!
    name: String!
    label(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale

      # List of languages the client is able to understand, and which locale variant is preferred.
      acceptLanguage: [Locale!]
    ): String
    isRequired: Boolean!
    attributeConstraint: AttributeConstraint!
    inputTip(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale

      # List of languages the client is able to understand, and which locale variant is preferred.
      acceptLanguage: [Locale!]
    ): String
    inputHint: TextInputHint!
    isSearchable: Boolean!
  }
`;

export default () => [commons, attributeDefinition];
