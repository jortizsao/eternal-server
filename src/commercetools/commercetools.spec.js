import Commercetools from './index';

describe('Commercetools service', () => {
  let commerceTools;

  const clientId = 'client1';
  const clientSecret = 'secret1';
  const projectKey = 'projectKey1';
  const host = 'https://api.commercetools.co';
  const oauthHost = 'https://auth.commercetools.co';

  beforeEach(() => {
    commerceTools = Commercetools({
      clientId,
      clientSecret,
      projectKey,
      host,
      oauthHost,
    });
  });

  describe('when getting the access token', () => {
    let accessToken;

    beforeEach(() => {
      spyOn(commerceTools, 'getNewToken').and.returnValue(
        Promise.resolve({
          accessToken: '12345abcde',
          expiresAt: 1525116039002,
        }),
      );
    });

    describe('when there is no access token', () => {
      beforeEach(async () => {
        commerceTools.setAccessToken(null);

        accessToken = await commerceTools.getAccessToken();
      });

      it('should request a new access token', () => {
        expect(commerceTools.getNewToken).toHaveBeenCalled();
      });

      it('should return the access token', () => {
        expect(accessToken).toBe('12345abcde');
      });
    });

    describe('when the access token is expired', () => {
      beforeEach(async () => {
        commerceTools.setAccessToken({
          access_token: '12345abcde',
          token_type: 'Bearer',
          expires_in: 172800,
        });

        spyOn(commerceTools, 'isTokenExpired').and.returnValue(true);

        accessToken = await commerceTools.getAccessToken();
      });

      it('should request a new access token', () => {
        expect(commerceTools.getNewToken).toHaveBeenCalled();
      });

      it('should return the access token', () => {
        expect(accessToken).toBe('12345abcde');
      });
    });
  });

  describe('when getting the expiration time', () => {
    let expirationTime;
    const twoHours = 7200000; // in ms
    const dateNow = 100000000;
    const expiresInSeconds = 172800;
    const expiresInMs = expiresInSeconds * 1000;
    // prettier-ignore
    const expectedExpirationTime = (dateNow + expiresInMs) - twoHours;

    beforeEach(() => {
      spyOn(Date, 'now').and.returnValue(dateNow);

      expirationTime = commerceTools.getExpirationTime(expiresInSeconds);
    });

    it('should get the expiration time with a two hours gap', () => {
      expect(expirationTime).toBe(expectedExpirationTime);
    });
  });

  describe('when checking if the token is expired', () => {
    const dateNow = 100000000;

    beforeEach(() => {
      spyOn(Date, 'now').and.returnValue(dateNow);
    });

    describe('when the token is expired', () => {
      const token = {
        expiresAt: dateNow - 1,
      };

      it('should return true', () => {
        expect(commerceTools.isTokenExpired(token)).toBe(true);
      });
    });

    describe('when the token is not expired', () => {
      const token = {
        expiresAt: dateNow + 1,
      };

      it('should return false', () => {
        expect(commerceTools.isTokenExpired(token)).toBe(false);
      });
    });
  });
});
