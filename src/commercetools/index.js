import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import { createQueueMiddleware } from '@commercetools/sdk-middleware-queue';
import { createRequestBuilder } from '@commercetools/api-request-builder';
import request from 'request-promise';

export default ({ clientId, clientSecret, projectKey, host, oauthHost, concurrency = 10 }) => {
  const commercetools = {};

  let token;

  commercetools.getExpirationTime = expiresIn => {
    if (expiresIn) {
      // Add a gap of 2 hours before expiration time.
      const twoHours = 2 * 60 * 60 * 1000;
      // prettier-ignore
      return Date.now() + ((expiresIn * 1000) - twoHours);
    }

    return 0;
  };

  commercetools.getNewToken = async () =>
    request
      .post({
        url: `${oauthHost}/oauth/token?grant_type=client_credentials&scope=manage_project:${projectKey}`,
        json: true,
      })
      .auth(clientId, clientSecret)
      .then(res => ({
        accessToken: res.access_token,
        expiresAt: commercetools.getExpirationTime(res.expires_in),
      }));

  commercetools.isTokenExpired = t => Date.now() > t.expiresAt;

  commercetools.client = createClient({
    middlewares: [
      createAuthMiddlewareForClientCredentialsFlow({
        host: oauthHost,
        projectKey,
        credentials: {
          clientId,
          clientSecret,
        },
      }),
      createQueueMiddleware({ concurrency }),
      createHttpMiddleware({ host }),
    ],
  });

  commercetools.getRequestBuilder = () => createRequestBuilder({ projectKey });

  commercetools.getApiHost = () => host;

  commercetools.getProjectKey = () => projectKey;

  commercetools.getAccessToken = async () => {
    if (!token || commercetools.isTokenExpired(token)) {
      token = await commercetools.getNewToken();
    }

    return token.accessToken;
  };

  commercetools.setAccessToken = t => {
    token = t;
  };

  return commercetools;
};
