const state = `
  enum StateType {
    OrderState
    ProductState
    ReviewState
    PaymentState
    LineItemState
  }

  enum StateRole {
    Return
    ReviewIncludedInStatistics
  }

  # [State](http://dev.commercetools.com/http-api-projects-states.html)
  type State implements Versioned {
    id: String!
    version: Long!
    key: String
    type: StateType!
    roles: [StateRole!]!
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
    builtIn: Boolean!
    transitionsRef: [Reference!]
    transitions: [State!]
    initial: Boolean!
    createdAt: DateTime!
    lastModifiedAt: DateTime!
  }
`;

export default () => [state];
