export default function ({ commercetools, entity }) {
  const ctClient = commercetools.ctClient;

  function updateEntity({ id, version, actions }) {
    return ctClient[entity].byId(id).update({
      version,
      actions,
    });
  }

  return {
    byId(id) {
      return ctClient[entity]
        .byId(id)
        .fetch()
        .then(res => res.body);
    },

    save(params) {
      return ctClient[entity].save(params).then(res => res.body);
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
        .then(res => res.body);
    },

    find({ filter, page, perPage, all, sortBy, sortAscending }) {
      let entityClient = ctClient[entity];

      if (all) {
        entityClient = entityClient.all();
      } else {
        // Bug in CT SDK if you get 'all()' then you can't sort, otherwise you will
        // get repeated results
        entityClient = sortBy ? entityClient.sort(sortBy, sortAscending) : entityClient;
        entityClient = page ? entityClient.page(page) : entityClient;
        entityClient = perPage ? entityClient.perPage(page) : entityClient;
      }
      return entityClient
        .where(filter)
        .fetch()
        .then(res => ({ results: res.body.results, total: res.body.total }));
    },
  };
}
