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
};
