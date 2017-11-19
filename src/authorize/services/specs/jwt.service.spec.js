import JwtService from '../jwt.service';

describe('Jwt Service', () => {
  const oneDayInSeconds = 86400;
  const jwtService = JwtService({ passphrase: 'this_is_a_passphrase', expiresIn: oneDayInSeconds });

  it('should throw an error if the jwt passphrase is not set', () => {
    try {
      JwtService({ passphrase: undefined });
      throw new Error('should have thrown an error');
    } catch (e) {
      expect(e.message).toBe('Please set the JWT token passphrase');
    }
  });

  it('should get an access token', () => {
    const payload = {
      id: 'id1',
      email: 'javier.ortizsaorin@gmail.com',
    };
    const baseTime = new Date('1982-02-11T00:00:00.000Z');

    jasmine.clock().install();
    jasmine.clock().mockDate(baseTime);

    // JWT Token for the payload
    // {
    //   "id": "id1",
    //   "email": "javier.ortizsaorin@gmail.com",
    //   "iat": 382233600,
    //   "exp": 382320000
    // }
    expect(jwtService.getAccessToken(payload)).toBe(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImlkMSIsImVtYWlsIjoiamF2aWVyLm9ydGl6c2FvcmluQGdtYWlsLmNvbSIsImlhdCI6MzgyMjMzNjAwLCJleHAiOjM4MjMyMDAwMH0.UoW1NDVFcI8E4Rf6ILyHqWG9JFQ5-m45KTaRlEs57XU',
    );
    jasmine.clock().uninstall();
  });
});
