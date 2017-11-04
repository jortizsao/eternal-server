import { SphereClient, Rest } from 'sphere-node-sdk';

export default ({ clientId, clientSecret, projectKey, host, oauthHost }) => {
  const ctConfig = {
    config: {
      client_id: clientId,
      client_secret: clientSecret,
      project_key: projectKey,
    },
    host,
    oauth_host: oauthHost,
  };

  return {
    ctClient: new SphereClient(ctConfig),
    restCTClient: new Rest(ctConfig),
  };
};
