import { makeExecutableSchema, makeRemoteExecutableSchema } from 'graphql-tools';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
import { setContext } from 'apollo-link-context';
import commercetoolsTypes from './commercetools.types';

export default ({ commercetools }) => {
  const apiHost = commercetools.getApiHost();
  const projectKey = commercetools.getProjectKey();

  const http = new HttpLink({ uri: `${apiHost}/${projectKey}/graphql`, fetch });

  const link = setContext(async () => {
    const token = await commercetools.getAccessToken();

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }).concat(http);

  const schema = makeExecutableSchema({ typeDefs: [commercetoolsTypes] });

  return makeRemoteExecutableSchema({
    schema,
    link,
  });
};
