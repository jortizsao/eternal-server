import pick from 'lodash/pick';

const getFacets = facets => {
  const facetsKeys = Object.keys(facets);

  if (!facetsKeys.length) {
    return null;
  }

  return facetsKeys.map(facetKey => ({
    facet: facetKey,
    ...facets[facetKey],
  }));
};

const commonProductData = [
  'masterVariant',
  'variants',
  'name',
  'description',
  'slug',
  'categoryOrderHints',
  'categories',
];

const getProductCatalogData = product =>
  pick(product, [...commonProductData, 'published', 'hasStagedChanges']);

const getProductData = productCatalogData => pick(productCatalogData, commonProductData);

export default {
  Query: {
    async productsSearch(
      root,
      {
        text,
        fuzzy,
        fuzzyLevel,
        facet,
        markMatchingVariants,
        filter,
        filterByQuery,
        filterByFacets,
        sort,
        limit,
        offset,
      },
      { productsService },
    ) {
      const result = await productsService.search({
        text,
        fuzzy,
        fuzzyLevel,
        facet,
        markMatchingVariants,
        filter,
        filterByQuery,
        filterByFacets,
        sort,
        limit,
        offset,
      });

      return {
        ...result,
        facets: getFacets(result.facets),
      };
    },
  },
  Product: {
    productTypeRef(product) {
      return product.productType;
    },
    productType() {
      throw new Error('Not implemented yet');
    },
    skus(product) {
      return [product.masterVariant, ...product.variants].map(v => v.sku);
    },
    stateRef(product) {
      return product.state;
    },
    state() {
      throw new Error('Not implemented yet');
    },
    taxCategoryRef(product) {
      return product.taxCategory;
    },
    taxCategory() {
      throw new Error('Not implemented yet');
    },
    masterData: getProductCatalogData,
    catalogData() {
      throw new Error('Not implemented yet');
    },
  },
  ProductCatalogData: {
    current: getProductData,
    staged: getProductData,
  },
  ProductData: {
    name(productData, { locale }) {
      return productData.name && productData.name[locale];
    },
    description(productData, { locale }) {
      return productData.description && productData.description[locale];
    },
    nameAllLocales(productData) {
      if (!productData.name) {
        return null;
      }

      return Object.keys(productData.name).map(locale => ({
        locale,
        value: productData.name[locale],
      }));
    },
    descriptionAllLocales(productData) {
      if (!productData.description) {
        return null;
      }

      return Object.keys(productData.description).map(locale => ({
        locale,
        value: productData.description[locale],
      }));
    },
    slug(productData, { locale }) {
      return productData.slug && productData.slug[locale];
    },
    categoryOrderHints() {
      return [];
    },
    categoryOrderHint() {
      throw new Error('Not implemented yet');
    },
    categoriesRef(productData) {
      return productData.categories;
    },
    categories() {
      return [];
    },
    searchKeyword() {
      throw new Error('Not implemented yet');
    },
    searchKeywords() {
      return [];
    },
    metaTitle(productData, { locale }) {
      return productData.metaTitle && productData.metaTitle[locale];
    },
    metaKeywords(productData, { locale }) {
      return productData.metaKeywords && productData.metaKeywords[locale];
    },
    metaDescription(productData, { locale }) {
      return productData.metaDescription && productData.metaDescription[locale];
    },
    masterVariant(productData) {
      return productData.masterVariant;
    },
    variants(productData) {
      return productData.variants;
    },
    allVariants(productData) {
      return [productData.masterVariant, ...productData.variants];
    },
    variant(productData, { sku, key }) {
      const allVariants = [productData.masterVariant, ...productData.variants];

      if (sku) {
        return allVariants.find(variant => variant.sku === sku);
      } else if (key) {
        return allVariants.find(variant => variant.key === key);
      }

      return null;
    },
    skus(productData) {
      return [productData.masterVariant, ...productData.variants].map(v => v.sku);
    },
  },
  ProductVariant: {
    price(productVariant, { currency, country, customerGroupId, channelId }) {
      return productVariant.prices.find(price => {
        const matchCurrency = currency
          ? price.value && price.value.currencyCode === currency
          : true;
        const matchCountry = country ? price.country === country : true;
        const matchCustomerGroup = customerGroupId
          ? price.customerGroup && price.customerGroup.id === customerGroupId
          : true;
        const matchChannel = channelId ? price.channel && price.channel.id === channelId : true;

        return matchCurrency && matchCountry && matchCustomerGroup && matchChannel;
      });
    },
    attributesRaw(productVariant, { includeNames, excludeNames }) {
      if (includeNames) {
        return productVariant.attributes.filter(attr =>
          includeNames.some(name => name === attr.name),
        );
      }

      if (excludeNames) {
        return productVariant.attributes.filter(attr =>
          excludeNames.every(name => name !== attr.name),
        );
      }

      return productVariant.attributes;
    },
  },
};
