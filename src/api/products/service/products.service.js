import { CommercetoolsError } from '../../../errors';

export default ({ commercetools }) => {
  const service = {};
  const { client, getRequestBuilder } = commercetools;

  service.search = async ({
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
  }) => {
    const originalUri = getRequestBuilder()
      .productProjectionsSearch.parse({
        text,
        fuzzy,
        ...(fuzzyLevel && { fuzzyLevel }),
        facet,
        markMatchingVariants,
        filter,
        filterByQuery,
        filterByFacets,
        sort,
      })
      .build();

    const uri = `${originalUri}&limit=${limit || 50}&offset=${offset || 0}`;

    return client
      .execute({
        uri,
        method: 'GET',
      })
      .then(res => res.body)
      .catch(err => Promise.reject(new CommercetoolsError(err)));
  };

  return service;
};
