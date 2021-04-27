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

  describe('registerUser', () => {
    const formValues = {
        email: 'test@test.com',
        newPassword: 'pandacon',
        newPasswordConfirm: 'pandacon',
        acceptedTerms: true,
        registration_stage: 'CUSTOMER',
      },
      returnedUser = {
        email: 'test@test.com',
        name: 'Test User',
      };

    beforeEach(() => {
      fetch.once(JSON.stringify(returnedUser));
    });

    it('Returns the partial user', async () => {
      const responseUser = await client.registerUser(formValues);
      expect(responseUser).toEqual(returnedUser);
    });

    it('Converts the input data to match the api', async () => {
      await client.registerUser(formValues);
      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          body: JSON.stringify({
            email: formValues.email,
            password1: formValues.newPassword,
            password2: formValues.newPasswordConfirm,
            accepted_terms: formValues.acceptedTerms,
            registration_stage: formValues.registration_stage,
          }),
        }),
      );
    });
  });
});
