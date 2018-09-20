import commons from './commons.type';

const discount = `
  interface ProductDiscountValue {
    type: String!
  }

  type DiscountedProductPriceValue {
    value: Money!
    discount: Reference! @deprecated(reason: "Will be removed due to naming inconsistencies. Please use 'discountRef'.")
    discountRef: Reference!

    # Temporal. Will be renamed some time in the future
    discountRel: ProductDiscount @deprecated(reason: "Will be removed in the future.")
  }

  #
  # A product price can be discounted in two ways:
  #
  # * with a relative or an absolute product discount, which will be automatically
  # applied to all prices in a product that match a discount predicate.
  #   A relative discount reduces the matching price by a fraction (for example 10 %
  # off). An absolute discount reduces the matching price by a fixed amount (for
  # example 10€ off). If more than one product discount matches a price, the
  # discount sort order determines which one will be applied.
  # * with an external product discount, which can then be used to explicitly set a
  # discounted value on a particular product price.
  #
  # The discounted price is stored in the discounted field of the Product Price.
  #
  # > Note that when a discount is created, updated or removed it can take up to 15
  # minutes to update all the prices with the discounts.
  #
  # The maximum number of ProductDiscounts that can be active at the same time is **200**.
  #
  type ProductDiscount implements Versioned {
    id: String!
    version: Long!
    predicate: String!
    validFrom: DateTime
    validUntil: DateTime
    isActive: Boolean!
    isValid: Boolean!
    sortOrder: String!
    createdAt: DateTime!
    lastModifiedAt: DateTime!
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
    value: ProductDiscountValue!
  }
`;

export default () => [commons, discount];
