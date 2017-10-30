import { SphereClient, Rest } from 'sphere-node-sdk';

export default ({ config }) => {
  const ctConfig = {
    config: {
      client_id: config.get('COMMERCE_TOOLS:CLIENT_ID'),
      client_secret: config.get('COMMERCE_TOOLS:CLIENT_SECRET'),
      project_key: config.get('COMMERCE_TOOLS:PROJECT_KEY'),
    },
    host: config.get('COMMERCE_TOOLS:API_HOST'),
    oauth_host: config.get('COMMERCE_TOOLS:OAUTH_URL'),
  };

  return {
    ctClient: new SphereClient(ctConfig),
    restCTClient: new Rest(ctConfig),
  };
};
