import fetch from 'jest-fetch-mock';
import { AuthenticationClient } from './AuthenticationClient';

describe('AuthenticationClient', () => {
  /** @type {AuthenticationClient} */
  let client;

  beforeEach(() => {
    fetch.resetMocks();
    client = new AuthenticationClient();
  });

  describe('login', () => {
    it('Returns the login response', async () => {
      const responseBody = {
        token: 'user-key-123',
        user: { id: 'user-id-123', email: 'test@test.com' },
      };
      fetch.once(JSON.stringify(responseBody));
      const response = await client.login({
        email: 'test@test.com',
        password: 'zxcvbn',
        accepted_terms: true,
      });
      expect(response).toEqual(responseBody);
    });
  });

  describe('logout', () => {
    it('makes the logout call', async () => {
      fetch.once('', { ok: true, status: 200 });
      await client.logout();
      expect(fetch).toBeCalledWith(
        expect.stringContaining('/logout/'),
        expect.anything(),
      );
    });
  });
});
