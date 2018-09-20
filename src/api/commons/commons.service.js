import { ConcurrencyError } from '../../errors';

export default function ({ commercetools, entity }) {
  const { client, getRequestBuilder } = commercetools;

  function updateEntity({ id, version, actions }) {
    return client.execute({
      // prettier-ignore
      uri: getRequestBuilder()[entity].parse({ id })
        .build(),
      method: 'POST',
      body: { version, actions },
    });
  }

  return {
    byId(id) {
      return client
        .execute({
          // prettier-ignore
          uri: getRequestBuilder()[entity].parse({ id })
            .build(),
          method: 'GET',
        })
        .then(res => res.body);
    },

    save(params) {
      return client
        .execute({
          uri: getRequestBuilder()[entity].build(),
          method: 'POST',
          body: params,
        })
        .then(res => res.body);
    },

    update({ id, version, actions }) {
      return Promise.resolve()
        .then(() => {
          if (version) {
            return updateEntity({ id, version, actions });
          }
          return this.byId(id).then(instance =>
            updateEntity({ id, version: instance.version, actions }),
          );
        })
        .then(res => res.body)
        .catch(err => {
          if (err.statusCode === 409) {
            throw new ConcurrencyError();
          }
          throw new Error(err);
        });
    },

    find({ where, page, perPage, sortBy, sortAscending, expand }) {
      let requestBuilder = getRequestBuilder()[entity];

      requestBuilder = where ? requestBuilder.where(where) : requestBuilder;
      requestBuilder = sortBy ? requestBuilder.sort(sortBy, sortAscending) : requestBuilder;
      requestBuilder = page ? requestBuilder.page(page) : requestBuilder;
      requestBuilder = perPage ? requestBuilder.perPage(perPage) : requestBuilder;
      requestBuilder = expand ? requestBuilder.expand(expand) : requestBuilder;

      return client
        .execute({
          uri: requestBuilder.build(),
          method: 'GET',
        })
        .then(res => ({ results: res.body.results, total: res.body.total }));
    },
  };
}
