import jwt from 'jsonwebtoken';

export default function ({ passphrase, expiresIn }) {
  if (passphrase) {
    return {
      getAccessToken(payload) {
        return jwt.sign(payload, passphrase, { expiresIn });
      },
    };
  } else {
    throw new Error('Please set the JWT token passphrase');
  }
}
