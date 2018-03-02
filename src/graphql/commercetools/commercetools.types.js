const schema = `
  type AbsoluteDiscountValue implements CartDiscountValue, ProductDiscountValue {
    money: [Money!]!
    type: String!
  }

  input AddLocation {
    location: ZoneLocation!
  }

  input AddShippingMethodShippingRate {
    zone: ReferenceInput!
    shippingRate: ShippingRateDraft!
  }

  input AddShippingMethodZone {
    zone: ReferenceInput!
  }

  interface Attribute {
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

  # (https://dev.commercetools.com/http-api-projects-productTypes.html#attributetype)[https://dev.commercetools.com/http-api-projects-productTypes.html#attributetype]
  interface AttributeDefinitionType {
    name: String!
  }

  # The "BigDecimal" scalar type represents signed fractional values with arbitrary precision.
  scalar BigDecimal

  type BooleanAttribute implements Attribute {
    value: Boolean!
    name: String!
  }

  type BooleanAttributeDefinitionType implements AttributeDefinitionType {
    name: String!
  }

  type BooleanField implements CustomField {
    value: Boolean!
    name: String!
  }

  type BooleanType implements FieldType {
    name: String!
  }

  #
  # Cart discounts are recalculated every time LineItems or CustomLineItems are
  # added or removed from the Cart or an order is created from the cart.
  #
  # The number of active cart discounts that do not require a discount code
  # (isActive=true and requiresDiscountCode=false) is limited to 100.
  #       
  type CartDiscount implements Versioned {
    id: String!
    version: Long!
    cartPredicate: String!
    validFrom: DateTime
    validUntil: DateTime
    stackingMode: StackingMode!
    isActive: Boolean!
    requiresDiscountCode: Boolean!
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
    customFieldsRaw(
      # The names of the custom fields to include.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all custom fields are returned.
      includeNames: [String!]

      # The names of the custom fields to exclude.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all custom fields are returned.
      excludeNames: [String!]
    ): [RawCustomField!] @deprecated(reason: "Do not use this field as it may be removed in the future")
    value: CartDiscountValue!
    target: CartDiscountTarget

    # Custom fields
    customFields: Type

    # Custom fields are returned as a list instead of an object structure.
    customFieldList(
      # The names of the custom fields to include.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all attributes are returned.
      includeNames: [String!]

      # The names of the custom fields to exclude.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all attributes are returned.
      excludeNames: [String!]
    ): [CustomField!]
  }

  type CartDiscountQueryResult {
    offset: Int!
    count: Int!
    total: Long!
    results: [CartDiscount!]!
  }

  interface CartDiscountTarget {
    type: String!
  }

  interface CartDiscountValue {
    type: String!
  }

  type Category implements Versioned {
    id: String!
    key: String
    version: Long!
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
    slug(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale

      # List of languages the client is able to understand, and which locale variant is preferred.
      acceptLanguage: [Locale!]
    ): String
    ancestorsRef: [Reference!]!
    ancestors: [Category!]!
    parentRef: Reference
    parent: Category
    orderHint: String!
    externalId: String
    metaTitle(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale

      # List of languages the client is able to understand, and which locale variant is preferred.
      acceptLanguage: [Locale!]
    ): String
    metaKeywords(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale

      # List of languages the client is able to understand, and which locale variant is preferred.
      acceptLanguage: [Locale!]
    ): String
    metaDescription(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale

      # List of languages the client is able to understand, and which locale variant is preferred.
      acceptLanguage: [Locale!]
    ): String

    # Number of a products in the category subtree.
    productCount: Int!

    # Number of direct child categories.
    childCount: Int!

    # Direct child categories.
    children: [Category!]
    createdAt: DateTime!
    lastModifiedAt: DateTime!
  }

  type CategoryOrderHint {
    categoryId: String!
    orderHint: String!
  }

  type CategoryQueryResult {
    offset: Int!
    count: Int!
    total: Long!
    results: [Category!]!
  }

  type CategorySearch {
    id: String!
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
    slug(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale

      # List of languages the client is able to understand, and which locale variant is preferred.
      acceptLanguage: [Locale!]
    ): String
    ancestorsRef: [Reference!]!
    ancestors: [CategorySearch!]!
    parentRef: Reference
    parent: CategorySearch
    externalId: String
    productCount: Int!
    childCount: Int!
    productTypeNames: [String!]!

    # Direct child categories.
    children: [CategorySearch!]!
    createdAt: DateTime!
    lastModifiedAt: DateTime!
  }

  type CategorySearchResult {
    offset: Int!
    count: Int!
    total: Int!
    results: [CategorySearch!]!
  }

  input ChangeDiscountCodeCartDiscounts {
    cartDiscounts: [ReferenceInput!]!
  }

  input ChangeDiscountCodeGroups {
    groups: [String!]!
  }

  input ChangeDiscountCodeIsActive {
    isActive: Boolean!
  }

  input ChangeShippingMethodIsDefault {
    isDefault: Boolean!
  }

  input ChangeShippingMethodName {
    name: String!
  }

  input ChangeShippingMethodTaxCategory {
    taxCategory: ReferenceInput!
  }

  input ChangeZoneName {
    name: String!
  }

  type Channel implements Versioned {
    id: String!
    version: Long!
    key: String!
    roles: [ChannelRole!]!
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
    createdAt: DateTime!
    lastModifiedAt: DateTime!
  }

  type ChannelQueryResult {
    offset: Int!
    count: Int!
    total: Long!
    results: [Channel!]!
  }

  type ChannelReferenceIdentifier {
    typeId: String!
    id: String
    key: String
  }

  enum ChannelRole {
    # Role tells that this channel can be used to track inventory entries.Channels with this role can be treated as warehouses
    InventorySupply

    # Role tells that this channel can be used to expose products to a specific
    # distribution channel. It can be used by the cart to select a product price.
    ProductDistribution

    # Role tells that this channel can be used to track order export activities.
    OrderExport

    # Role tells that this channel can be used to track order import activities.
    OrderImport

    # This role can be combined with some other roles (e.g. with "InventorySupply")
    # to represent the fact that this particular channel is the primary/master
    # channel among the channels of the same type.
    Primary
  }

  # [ISO 3166-1](http://en.wikipedia.org/wiki/ISO_3166-1) country code.
  scalar Country

  input CreateZone {
    name: String!
    description: String
    locations: [ZoneLocation!] = []
  }

  # Represents a currency. Currencies are identified by their [ISO
  # 4217](http://www.iso.org/iso/home/standards/currency_codes.htm) currency codes.
  scalar Currency

  # A customer can be a member in a customer group (e.g. reseller, gold member). A
  # customer group can be used in price calculations with special prices being
  # assigned to certain customer groups.
  type CustomerGroup implements Versioned {
    id: String!
    version: Long!
    name: String!
    key: String
    createdAt: DateTime!
    lastModifiedAt: DateTime!
  }

  type CustomerGroupQueryResult {
    offset: Int!
    count: Int!
    total: Long!
    results: [CustomerGroup!]!
  }

  interface CustomField {
    name: String!
  }

  input CustomFieldInput {
    name: String!
    value: String!
  }

  input CustomFieldsDraft {
    typeId: String
    typeKey: String
    type: ResourceIdentifierInput
    fields: [CustomFieldInput!]
  }

  type CustomLineItemsTarget implements CartDiscountTarget {
    predicate: String!
    type: String!
  }

  # DateTime is a scalar value that represents an ISO8601 formatted date.
  scalar Date

  type DateAttribute implements Attribute {
    value: Date!
    name: String!
  }

  type DateAttributeDefinitionType implements AttributeDefinitionType {
    name: String!
  }

  type DateField implements CustomField {
    value: Date!
    name: String!
  }

  # DateTime is a scalar value that represents an ISO8601 formatted date and time.
  scalar DateTime

  type DateTimeAttribute implements Attribute {
    value: DateTime!
    name: String!
  }

  type DateTimeAttributeDefinitionType implements AttributeDefinitionType {
    name: String!
  }

  type DateTimeField implements CustomField {
    value: DateTime!
    name: String!
  }

  type DateTimeType implements FieldType {
    name: String!
  }

  type DateType implements FieldType {
    name: String!
  }

  type Dimensions {
    width: Int!
    height: Int!
  }

  # With discount codes it is possible to give specific cart discounts to an
  # eligible amount of users. They are defined by a string value which can be added
  # to a cart so that specific cart discounts can be applied to the cart.
  type DiscountCode implements Versioned {
    id: String!
    version: Long!
    code: String!
    isActive: Boolean!
    maxApplications: Long
    maxApplicationsPerCustomer: Long
    cartPredicate: String
    applicationVersion: Long
    createdAt: DateTime!
    lastModifiedAt: DateTime!
    validFrom: DateTime
    validUntil: DateTime
    groups: [String!]!
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
    nameAllLocales: [LocalizedString!]
    descriptionAllLocales: [LocalizedString!]
    customFieldsRaw(
      # The names of the custom fields to include.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all custom fields are returned.
      includeNames: [String!]

      # The names of the custom fields to exclude.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all custom fields are returned.
      excludeNames: [String!]
    ): [RawCustomField!] @deprecated(reason: "Do not use this field as it may be removed in the future")
    cartDiscounts: [CartDiscount!]!

    # Custom fields
    customFields: Type

    # Custom fields are returned as a list instead of an object structure.
    customFieldList(
      # The names of the custom fields to include.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all attributes are returned.
      includeNames: [String!]

      # The names of the custom fields to exclude.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all attributes are returned.
      excludeNames: [String!]
    ): [CustomField!]
  }

  input DiscountCodeDraft {
    code: String!
    name: [LocalizedStringInput!]
    description: [LocalizedStringInput!]
    cartDiscounts: [ReferenceInput!]!
    isActive: Boolean = true
    maxApplications: Long
    maxApplicationsPerCustomer: Long
    cartPredicate: String
    custom: CustomFieldsDraft
    validFrom: DateTime
    validUntil: DateTime
    groups: [String!] = []
  }

  type DiscountCodeQueryResult {
    offset: Int!
    count: Int!
    total: Long!
    results: [DiscountCode!]!
  }

  input DiscountCodeUpdateAction {
    setName: SetDiscountCodeName
    setDescription: SetDiscountCodeDescription
    setCartPredicate: SetDiscountCodeCartPredicate
    setMaxApplications: SetDiscountCodeMaxApplications
    setMaxApplicationsPerCustomer: SetDiscountCodeMaxApplicationsPerCustomer
    changeCartDiscounts: ChangeDiscountCodeCartDiscounts
    changeIsActive: ChangeDiscountCodeIsActive
    setCustomType: SetDiscountCodeCustomType
    setCustomField: SetDiscountCodeCustomField
    setValidFrom: SetDiscountCodeValidFrom
    setValidUntil: SetDiscountCodeValidUntil
    changeGroups: ChangeDiscountCodeGroups
  }

  type DiscountedProductPriceValue {
    value: Money!
    discount: Reference! @deprecated(reason: "Will be removed due to naming inconsistencies. Please use 'discountRef'.")
    discountRef: Reference!

    # Temporal. Will be renamed some time in the future
    discountRel: ProductDiscount @deprecated(reason: "Will be removed in the future.")
  }

  type EnumAttribute implements Attribute {
    key: String!
    label: String!
    name: String!
  }

  type EnumAttributeDefinitionType implements AttributeDefinitionType {
    values: [PlainEnumValue!]!
    name: String!
  }

  type EnumField implements CustomField {
    key: String!
    label: String!
    name: String!
  }

  type EnumType implements FieldType {
    values: [EnumValue!]!
    name: String!
  }

  type EnumValue {
    key: String!
    label: String!
  }

  type ExternalDiscountValue implements ProductDiscountValue {
    type: String!
  }

  # Field definitions describe custom fields and allow you to define some meta-information associated with the field.
  type FieldDefinition {
    name: String!
    required: Boolean!
    inputHint: TextInputHint!
    label(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale

      # List of languages the client is able to understand, and which locale variant is preferred.
      acceptLanguage: [Locale!]
    ): String
    labelAllLocales: [LocalizedString!]!
    type: FieldType!
  }

  interface FieldType {
    name: String!
  }

  type GiftLineItemValue implements CartDiscountValue {
    type: String!
    variantId: Int!
    productRef: ProductReferenceIdentifier!
    distributionChannelRef: ChannelReferenceIdentifier
    supplyChannelRef: ChannelReferenceIdentifier
  }

  type Image {
    url: String!
    dimensions: Dimensions!
    label: String
  }

  # Raw JSON value
  scalar Json

  type LineItemsTarget implements CartDiscountTarget {
    predicate: String!
    type: String!
  }

  # Locale is a scalar value represented as a string language tag.
  scalar Locale

  type LocalizableEnumAttributeDefinitionType implements AttributeDefinitionType {
    values: [LocalizableEnumValueType!]!
    name: String!
  }

  type LocalizableEnumValueType {
    key: String!
    labelAllLocales: [LocalizedString!]!
  }

  type LocalizableTextAttributeDefinitionType implements AttributeDefinitionType {
    name: String!
  }

  type LocalizedEnumAttribute implements Attribute {
    key: String!
    label(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale!
    ): String
    name: String!
  }

  type LocalizedEnumField implements CustomField {
    key: String!
    label(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale!
    ): String
    name: String!
  }

  type LocalizedEnumType implements FieldType {
    values: [LocalizedEnumValue!]!
    name: String!
  }

  type LocalizedEnumValue {
    key: String!
    label(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale

      # List of languages the client is able to understand, and which locale variant is preferred.
      acceptLanguage: [Locale!]
    ): String
    labelAllLocales: [LocalizedString!]!
  }

  type LocalizedString {
    locale: Locale!
    value: String!
  }

  type LocalizedStringAttribute implements Attribute {
    value(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale!
    ): String
    name: String!
  }

  type LocalizedStringField implements CustomField {
    value(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale!
    ): String
    name: String!
  }

  input LocalizedStringInput {
    locale: Locale!
    value: String!
  }

  type LocalizedStringType implements FieldType {
    name: String!
  }

  input LocalizedText {
    text: String!
    locale: Locale!
  }

  type Location {
    country: Country!
    state: String
  }

  # The "Long" scalar type represents non-fractional signed whole numeric values.
  # Long can represent values between -(2^63) and 2^63 - 1.
  scalar Long

  # Sunrise Product Data Set Structure
  type mainProductType implements ProductType {
    productTypeId: String!
    color: LocalizedEnumAttribute
    creationDate: DateTimeAttribute
    articleNumberMax: StringAttribute
    matrixId: StringAttribute
    baseId: StringAttribute
    designer: EnumAttribute
    madeInItaly: EnumAttribute
    completeTheLook: [StringAttribute!]
    commonSize: EnumAttribute
    size: StringAttribute
    articleNumberManufacturer: StringAttribute
    colorFreeDefinition: LocalizedStringAttribute
    details: [LocalizedStringAttribute!]
    style: EnumAttribute
    gender: EnumAttribute
    season: StringAttribute
    isOnStock: BooleanAttribute
    isLook: BooleanAttribute
    lookProducts: [StringAttribute!]
    seasonNew: StringAttribute
  }

  type Money {
    currencyCode: Currency!
    centAmount: Long!
  }

  type MoneyAttribute implements Attribute {
    centAmount: Long!
    currencyCode: Currency!
    name: String!
  }

  type MoneyAttributeDefinitionType implements AttributeDefinitionType {
    name: String!
  }

  input MoneyDraft {
    currencyCode: Currency!
    centAmount: Long!
  }

  type MoneyField implements CustomField {
    centAmount: Long!
    currencyCode: Currency!
    name: String!
  }

  type MoneyType implements FieldType {
    name: String!
  }

  type MultiBuyCustomLineItemsTarget implements CartDiscountTarget {
    predicate: String!
    triggerQuantity: Int!
    discountedQuantity: Int!
    maxOccurrence: Int
    selectionMode: SelectionMode!
    type: String!
  }

  type MultiBuyLineItemsTarget implements CartDiscountTarget {
    predicate: String!
    triggerQuantity: Int!
    discountedQuantity: Int!
    maxOccurrence: Int
    selectionMode: SelectionMode!
    type: String!
  }

  type Mutation {
    createDiscountCode(draft: DiscountCodeDraft!): DiscountCode
    updateDiscountCode(id: String!, version: Long!, actions: [DiscountCodeUpdateAction!]!): DiscountCode
    deleteDiscountCode(id: String!, version: Long!): DiscountCode
    createZone(draft: CreateZone!): Zone
    updateZone(id: String!, version: Long!, actions: [ZoneUpdateAction!]!): Zone
    deleteZone(id: String!, version: Long!): Zone
    createShippingMethod(draft: ShippingMethodDraft!): ShippingMethod
    updateShippingMethod(
      # Queries with specified ID
      id: String

      # Queries with specified key
      key: String
      version: Long!
      actions: [UpdateShippingMethodAction!]!
    ): ShippingMethod
    deleteShippingMethod(
      # Queries with specified ID
      id: String

      # Queries with specified key
      key: String
      version: Long!
    ): ShippingMethod
    createTaxCategory(draft: TaxCategoryDraft!): TaxCategory
    updateTaxCategory(
      # Queries with specified ID
      id: String

      # Queries with specified key
      key: String
      version: Long!
      actions: [TaxCategoryUpdateAction!]!
    ): TaxCategory
    deleteTaxCategory(
      # Queries with specified ID
      id: String

      # Queries with specified key
      key: String
      version: Long!
    ): TaxCategory
  }

  type NestedAttributeDefinitionType implements AttributeDefinitionType {
    typeReference: Reference!
    name: String!
  }

  type NumberAttribute implements Attribute {
    value: BigDecimal!
    name: String!
  }

  type NumberAttributeDefinitionType implements AttributeDefinitionType {
    name: String!
  }

  type NumberField implements CustomField {
    value: BigDecimal!
    name: String!
  }

  type NumberType implements FieldType {
    name: String!
  }

  type PlainEnumValue {
    key: String!
    label: String!
  }

  type PriceFunction {
    function: String!
    currencyCode: String!
  }

  input PriceFunctionDraft {
    function: String!
    currencyCode: String!
  }

  type Product implements Versioned {
    id: String!
    key: String
    version: Long!
    productTypeRef: Reference!
    productType: ProductTypeDefinition
    masterData: ProductCatalogData!
    catalogData(id: String!): ProductCatalogData
    skus: [String!]!
    createdAt: DateTime!
    lastModifiedAt: DateTime!
    stateRef: Reference
    state: State
    taxCategoryRef: Reference
    taxCategory: TaxCategory
  }

  type ProductCatalogData {
    current: ProductData!
    staged: ProductData!
    published: Boolean!
    hasStagedChanges: Boolean!
  }

  type ProductData {
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
    slug(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale

      # List of languages the client is able to understand, and which locale variant is preferred.
      acceptLanguage: [Locale!]
    ): String
    categoryOrderHint(categoryId: String!): String
    categoryOrderHints: [CategoryOrderHint!]!
    categoriesRef: [Reference!]!
    categories: [Category!]!
    searchKeyword(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale!
    ): [SearchKeyword!]
    searchKeywords: [SearchKeywords!]!
    metaTitle(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale

      # List of languages the client is able to understand, and which locale variant is preferred.
      acceptLanguage: [Locale!]
    ): String
    metaKeywords(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale

      # List of languages the client is able to understand, and which locale variant is preferred.
      acceptLanguage: [Locale!]
    ): String
    metaDescription(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale

      # List of languages the client is able to understand, and which locale variant is preferred.
      acceptLanguage: [Locale!]
    ): String
    masterVariant: ProductVariant!
    variants: [ProductVariant!]!
    allVariants: [ProductVariant!]!
    variant(
      # Queries for a variant with specified SKU
      sku: String

      # Queries for a variant with specified [key](https://dev.commercetools.com/http-api-projects-products.html#variant_key)
      key: String
    ): ProductVariant
    skus: [String!]!
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

  type ProductDiscountQueryResult {
    offset: Int!
    count: Int!
    total: Long!
    results: [ProductDiscount!]!
  }

  interface ProductDiscountValue {
    type: String!
  }

  type ProductPrice {
    id: String
    value: Money!
    country: Country
    customerGroup: Reference
    channel: Reference
    validFrom: DateTime
    validUntil: DateTime
    discounted: DiscountedProductPriceValue
  }

  type ProductQueryResult {
    offset: Int!
    count: Int!
    total: Long!
    results: [Product!]!
  }

  type ProductReferenceIdentifier {
    typeId: String!
    id: String
    key: String
  }

  interface ProductType {
    productTypeId: String!
  }

  type ProductTypeDefinition implements Versioned {
    key: String
    name: String!
    description: String!
    attributeDefinitions(
      # The names of the attribute definitions to include.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all attribute definitions are returned.
      includeNames: [String!]

      # The names of the attribute definitions to exclude.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all attribute definitions are returned.
      excludeNames: [String!]
    ): [AttributeDefinition!]!
    id: String!
    version: Long!
    createdAt: DateTime!
    lastModifiedAt: DateTime!
  }

  type ProductTypeDefinitionQueryResult {
    offset: Int!
    count: Int!
    total: Long!
    results: [ProductTypeDefinition!]!
  }

  type ProductVariant {
    id: Int!
    key: String
    sku: String
    prices: [ProductPrice!]

    # Returns a single price based on the price selection rules.
    price(currency: Currency!, country: Country, customerGroupId: String, channelId: String, date: DateTime): ProductPrice
    images: [Image!]!
    attributesRaw(
      # The names of the attributes to include.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all attributes are returned.
      includeNames: [String!]

      # The names of the attributes to exclude.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all attributes are returned.
      excludeNames: [String!]
    ): [RawProductAttribute!]! @deprecated(reason: "Do not use this field as it may be removed in the future")

    # Product attributes
    attributes: ProductType!

    # Product attributes are returned as a list instead of an object structure.
    attributeList(
      # The names of the attributes to include.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all attributes are returned.
      includeNames: [String!]

      # The names of the attributes to exclude.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all attributes are returned.
      excludeNames: [String!]
    ): [Attribute!]!
  }

  type Query {
    product(
      # Queries for a product with specified ID
      id: String

      # Queries for a product with specified [product key](https://dev.commercetools.com/http-api-projects-products.html#key)
      key: String

      # Queries for a product with specified SKU
      sku: String

      # Queries for a product with specified [product variant key](https://dev.commercetools.com/http-api-projects-products.html#variant_key)
      variantKey: String
    ): Product
    products(
      where: String
      sort: [String!]
      limit: Int
      offset: Int

      # Queries for products with specified SKUs
      skus: [String!]
    ): ProductQueryResult!
    productType(
      # Queries with specified ID
      id: String

      # Queries with specified key
      key: String
    ): ProductTypeDefinition
    productTypes(where: String, sort: [String!], limit: Int, offset: Int): ProductTypeDefinitionQueryResult!
    channel(id: String!): Channel
    channels(where: String, sort: [String!], limit: Int, offset: Int): ChannelQueryResult!
    category(
      # Queries for a category with specified ID
      id: String

      # Queries for a category with specified [category
      # key](https://dev.commercetools.com/http-api-projects-categories.html#key)
      key: String
    ): Category
    categories(where: String, sort: [String!], limit: Int, offset: Int): CategoryQueryResult!

    # Autocomplete the categories based on category fields like name, description, etc.
    categoryAutocomplete(
      # String is define for different locales. This argument specifies the desired locale.
      locale: Locale!

      # Incomplete user input.
      text: String!
      limit: Int = 10
      offset: Int = 0

      # Filters to apply during the autocomplete - supported fields are:
      # * "id"
      # * "slug"
      # * "externalId"
      # * "ancestors"
      # * "parent.id"
      # * "level"
      # * "createdAt"
      # * "modifiedAt"
      # * "name.{language}:missing"
      # * "externalId:missing"
      # * "description.{language}:missing"
      # * "childCount"
      # * "productCount"
      # * "productTypeNames"
      filters: [SearchFilter!]
    ): CategorySearchResult!

    # Search the categories using full-text search, filtering and sorting
    categorySearch(
      # Full-text search input.
      fulltext: LocalizedText
      limit: Int = 10
      offset: Int = 0

      # Filters to apply before the results of facets
      queryFilters: [SearchFilter!]

      # Filters to apply during the autocomplete - supported fields are:
      # * "id"
      # * "slug"
      # * "externalId"
      # * "ancestors"
      # * "parent.id"
      # * "level"
      # * "createdAt"
      # * "modifiedAt"
      # * "name.{language}:missing"
      # * "externalId:missing"
      # * "description.{language}:missing"
      # * "childCount"
      # * "productCount"
      # * "productTypeNames"
      filters: [SearchFilter!]

      # Sort result - supported fields are:
      #
      # * "id"
      # * "name"
      # * "createdAt"
      # * "modifiedAt"
      #
      # by default sorted by relevance (a score of matches against the search term in descending order)
      #
      sorts: [SearchSort!]
    ): CategorySearchResult!
    customerGroup(
      # Queries for a customer group with specified ID
      id: String

      # Queries for a customer group with specified [customer group key](https://dev.commercetools.com/http-api-projects-customerGroups.html#key)
      key: String
    ): CustomerGroup
    customerGroups(where: String, sort: [String!], limit: Int, offset: Int): CustomerGroupQueryResult!
    discountCode(id: String!): DiscountCode
    discountCodes(where: String, sort: [String!], limit: Int, offset: Int): DiscountCodeQueryResult!
    cartDiscount(id: String!): CartDiscount
    cartDiscounts(where: String, sort: [String!], limit: Int, offset: Int): CartDiscountQueryResult!
    productDiscount(id: String!): ProductDiscount
    productDiscounts(where: String, sort: [String!], limit: Int, offset: Int): ProductDiscountQueryResult!
    taxCategory(id: String!): TaxCategory
    taxCategories(where: String, sort: [String!], limit: Int, offset: Int): TaxCategoryQueryResult!
    zone(id: String!): Zone
    zones(where: String, sort: [String!], limit: Int, offset: Int): ZoneQueryResult!
    shippingMethod(id: String!): ShippingMethod
    shippingMethods(where: String, sort: [String!], limit: Int, offset: Int): ShippingMethodQueryResult!
    typeDefinition(id: String!): TypeDefinition
    typeDefinitions(where: String, sort: [String!], limit: Int, offset: Int): TypeDefinitionQueryResult!
  }

  type RawCustomField {
    name: String!
    value: Json!
  }

  type RawProductAttribute {
    name: String!
    value: Json!
    attributeDefinition: AttributeDefinition
  }

  type Reference {
    typeId: String!
    id: String!
  }

  type ReferenceAttribute implements Attribute {
    typeId: String!
    id: String!
    name: String!
  }

  type ReferenceAttributeDefinitionType implements AttributeDefinitionType {
    referenceTypeId: String!
    name: String!
  }

  type ReferenceField implements CustomField {
    typeId: String!
    id: String!
    name: String!
  }

  input ReferenceInput {
    typeId: String!
    id: String!
  }

  type ReferenceType implements FieldType {
    referenceTypeId: String!
    name: String!
  }

  type RelativeDiscountValue implements CartDiscountValue, ProductDiscountValue {
    permyriad: Int!
    type: String!
  }

  input RemoveLocation {
    location: ZoneLocation!
  }

  input RemoveShippingMethodShippingRate {
    zone: ReferenceInput!
    shippingRate: ShippingRateDraft!
  }

  input RemoveShippingMethodZone {
    zone: ReferenceInput!
  }

  input ResourceIdentifierInput {
    id: String
    key: String
  }

  # Search filter. It is represented as a string and has th same format as in REST API: "field:filter_criteria"
  scalar SearchFilter

  type SearchKeyword {
    text: String!
  }

  type SearchKeywords {
    locale: Locale!
    searchKeywords: [SearchKeyword!]!
  }

  # Search sort
  scalar SearchSort

  # In order to decide which of the matching items will actually be discounted
  enum SelectionMode {
    MostExpensive
    Cheapest
  }

  type SetAttributeDefinitionType implements AttributeDefinitionType {
    elementType: AttributeDefinitionType!
    name: String!
  }

  input SetDiscountCodeCartPredicate {
    cartPredicate: String
  }

  input SetDiscountCodeCustomField {
    name: String!
    value: String
  }

  input SetDiscountCodeCustomType {
    typeId: String
    typeKey: String
    type: ResourceIdentifierInput
    fields: [CustomFieldInput!]
  }

  input SetDiscountCodeDescription {
    description: [LocalizedStringInput!]
  }

  input SetDiscountCodeMaxApplications {
    maxApplications: Long
  }

  input SetDiscountCodeMaxApplicationsPerCustomer {
    maxApplicationsPerCustomer: Long
  }

  input SetDiscountCodeName {
    name: [LocalizedStringInput!]
  }

  input SetDiscountCodeValidFrom {
    validFrom: DateTime
  }

  input SetDiscountCodeValidUntil {
    validUntil: DateTime
  }

  input SetShippingMethodDescription {
    description: String
  }

  input SetShippingMethodKey {
    key: String
  }

  input SetShippingMethodPredicate {
    predicate: String
  }

  input SetTaxCategoryKey {
    key: String!
  }

  type SetType implements FieldType {
    elementType: FieldType!
    name: String!
  }

  input SetZoneDescription {
    description: String
  }

  type ShippingMethod {
    id: String!
    version: Long!
    name: String!
    description: String
    taxCategory: Reference!
    zoneRates: [ZoneRate!]!
    isDefault: Boolean!
    predicate: String
    createdAt: DateTime!
    lastModifiedAt: DateTime!
    key: String
  }

  input ShippingMethodDraft {
    name: String!
    description: String
    taxCategory: ReferenceInput!
    zoneRates: [ZoneRateDraft!] = []
    isDefault: Boolean!
    predicate: String
    key: String
  }

  type ShippingMethodQueryResult {
    offset: Int!
    count: Int!
    total: Long!
    results: [ShippingMethod!]!
  }

  # Shipping Rate
  type ShippingRate {
    price: Money!
    freeAbove: Money
    isMatching: Boolean
    tiers: [ShippingRatePriceTier!]!
  }

  type ShippingRateCartClassificationPriceTier implements ShippingRatePriceTier {
    value: String!
    price: Money!
    isMatching: Boolean
    type: String!
  }

  type ShippingRateCartScorePriceTier implements ShippingRatePriceTier {
    score: Int!
    price: Money
    priceFunction: PriceFunction
    isMatching: Boolean
    type: String!
  }

  type ShippingRateCartValuePriceTier implements ShippingRatePriceTier {
    minimumCentAmount: Int!
    price: Money!
    isMatching: Boolean
    type: String!
  }

  input ShippingRateDraft {
    price: MoneyDraft!
    freeAbove: MoneyDraft
    tiers: [ShippingRatePriceTierDraft!] = []
  }

  interface ShippingRatePriceTier {
    type: String!
  }

  input ShippingRatePriceTierCartClassificationDraft {
    value: String!
    price: MoneyDraft!
  }

  input ShippingRatePriceTierCartScoreDraft {
    score: Int!
    price: MoneyDraft
    priceFunction: PriceFunctionDraft
  }

  input ShippingRatePriceTierCartValueDraft {
    minimumCentAmount: Int!
    price: MoneyDraft!
  }

  input ShippingRatePriceTierDraft {
    CartValue: ShippingRatePriceTierCartValueDraft
    CartClassification: ShippingRatePriceTierCartClassificationDraft
    CartScore: ShippingRatePriceTierCartScoreDraft
  }

  type ShippingTarget implements CartDiscountTarget {
    type: String!
  }

  # Describes how this discount interacts with other discounts
  enum StackingMode {
    # Don’t apply any more matching discounts after this one.
    StopAfterThisDiscount

    # Default. Continue applying other matching discounts after applying this one.
    Stacking
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

  enum StateRole {
    Return
    ReviewIncludedInStatistics
  }

  enum StateType {
    OrderState
    ProductState
    ReviewState
    PaymentState
    LineItemState
  }

  type StringAttribute implements Attribute {
    value: String!
    name: String!
  }

  type StringField implements CustomField {
    value: String!
    name: String!
  }

  type StringType implements FieldType {
    name: String!
  }

  type SubRate {
    name: String!
    amount: Float!
  }

  input SubRateDraft {
    name: String!
    amount: Float!
  }

  # Tax Categories define how products are to be taxed in different countries.
  type TaxCategory {
    id: String!
    version: Long!
    name: String!
    description: String
    rates: [TaxRate!]!
    createdAt: DateTime!
    lastModifiedAt: DateTime!
    key: String
  }

  input TaxCategoryAddTaxRate {
    taxRate: TaxRateDraft!
  }

  input TaxCategoryChangeName {
    name: String!
  }

  input TaxCategoryDraft {
    name: String!
    description: String
    rates: [TaxRateDraft!]
    key: String
  }

  type TaxCategoryQueryResult {
    offset: Int!
    count: Int!
    total: Long!
    results: [TaxCategory!]!
  }

  input TaxCategoryRemoveTaxRate {
    taxRateId: String!
  }

  input TaxCategoryReplaceTaxRate {
    taxRateId: String!
    taxRate: TaxRateDraft!
  }

  input TaxCategorySetDescription {
    description: String
  }

  input TaxCategoryUpdateAction {
    changeName: TaxCategoryChangeName
    setDescription: TaxCategorySetDescription
    addTaxRate: TaxCategoryAddTaxRate
    replaceTaxRate: TaxCategoryReplaceTaxRate
    removeTaxRate: TaxCategoryRemoveTaxRate
    setKey: SetTaxCategoryKey
  }

  type TaxRate {
    name: String!
    amount: Float!
    includedInPrice: Boolean!
    country: Country!
    state: String
    id: String
    subRates: [SubRate!]!
  }

  input TaxRateDraft {
    name: String!
    amount: Float
    includedInPrice: Boolean!
    country: Country!
    state: String
    subRates: [SubRateDraft!] = []
  }

  type TextAttributeDefinitionType implements AttributeDefinitionType {
    name: String!
  }

  enum TextInputHint {
    SingleLine
    MultiLine
  }

  # Time is a scalar value that represents an ISO8601 formatted time.
  scalar Time

  type TimeAttribute implements Attribute {
    value: Time!
    name: String!
  }

  type TimeAttributeDefinitionType implements AttributeDefinitionType {
    name: String!
  }

  type TimeField implements CustomField {
    value: Time!
    name: String!
  }

  type TimeType implements FieldType {
    name: String!
  }

  interface Type {
    typeRef: Reference!
    type: TypeDefinition!
  }

  # Types define the structure of custom fields which can be attached to different entities throughout the platform.
  type TypeDefinition implements Versioned {
    id: String!
    version: Long!
    key: String!
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
    resourceTypeIds: [String!]!
    fieldDefinitions(
      # The names of the custom field definitions to include.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all custom fields are returned.
      includeNames: [String!]

      # The names of the custom field definitions to exclude.
      #
      # If neither "includeNames" nor "excludeNames" are provided, then all custom fields are returned.
      excludeNames: [String!]
    ): [FieldDefinition!]!
  }

  type TypeDefinitionQueryResult {
    offset: Int!
    count: Int!
    total: Long!
    results: [TypeDefinition!]!
  }

  input UpdateShippingMethodAction {
    changeName: ChangeShippingMethodName
    setDescription: SetShippingMethodDescription
    changeTaxCategory: ChangeShippingMethodTaxCategory
    changeIsDefault: ChangeShippingMethodIsDefault
    addShippingRate: AddShippingMethodShippingRate
    removeShippingRate: RemoveShippingMethodShippingRate
    addZone: AddShippingMethodZone
    removeZone: RemoveShippingMethodZone
    setKey: SetShippingMethodKey
    setPredicate: SetShippingMethodPredicate
  }

  # Versioned object have an ID and version and modification. Every update of this object changes it's version.
  interface Versioned {
    id: String!
    version: Long!
    createdAt: DateTime!
    lastModifiedAt: DateTime!
  }

  # Zones allow defining ShippingRates for specific Locations.
  type Zone {
    id: String!
    version: Long!
    name: String!
    description: String
    createdAt: DateTime!
    lastModifiedAt: DateTime!
    locations: [Location!]!
  }

  input ZoneLocation {
    country: Country!
    state: String
  }

  type ZoneQueryResult {
    offset: Int!
    count: Int!
    total: Long!
    results: [Zone!]!
  }

  type ZoneRate {
    zone: Reference!
    shippingRates: [ShippingRate!]!
  }

  input ZoneRateDraft {
    zone: ReferenceInput!
    shippingRates: [ShippingRateDraft!] = []
  }

  input ZoneUpdateAction {
    changeName: ChangeZoneName
    setDescription: SetZoneDescription
    addLocation: AddLocation
    removeLocation: RemoveLocation
  }
`;

export default schema;
