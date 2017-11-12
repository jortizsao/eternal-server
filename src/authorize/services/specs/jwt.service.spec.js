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
      firstName: 'javier',
      lastName: 'ortiz saorin',
    };
    const baseTime = new Date('1982-02-11T00:00:00.000Z');

    jasmine.clock().install();
    jasmine.clock().mockDate(baseTime);

    // JWT Token for the payload
    // {
    //   "id": "id1",
    //   "firstName": "javier",
    //   "lastName": "ortiz saorin",
    //   "iat": 382233600,
    //   "exp": 382320000
    // }
    expect(jwtService.getAccessToken(payload)).toBe(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImlkMSIsImZpcnN0TmFtZSI6ImphdmllciIsImxhc3ROYW1lIjoib3J0aXogc2FvcmluIiwiaWF0IjozODIyMzM2MDAsImV4cCI6MzgyMzIwMDAwfQ.OQATB0jo0Zzz7DVWvo066zQ-If6t86FgzVBu8BH389s',
    );
    jasmine.clock().uninstall();
  });
});
