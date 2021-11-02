import fetch from 'jest-fetch-mock';

import { AuthenticationClient } from './AuthenticationClient';

fetch.enableMocks();

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

  describe('verifyEmail', () => {
    it('Returns the user from the response', async () => {
      const user = { email: 'test@test.com', name: 'Test User' };
      fetch.once(JSON.stringify(user));
      const responseUser = await client.verifyEmail({ key: '123' });
      expect(responseUser).toEqual(user);
    });
  });

  describe('sendVerificationEmail', () => {
    it('Returns the email from the response', async () => {
      const email = 'test@test.com',
        otherEmail = 'test@other.com';
      fetch.once(JSON.stringify({ email: otherEmail }));
      const response = await client.sendVerificationEmail({ email });
      expect(response).toEqual({ email: otherEmail });
    });
  });

  describe('changePassword', () => {
    const params = { newPassword: 'pandacon', newPasswordConfirm: 'pandacon' },
      responseBody = {
        new_password1: params.newPassword,
        new_password2: params.newPasswordConfirm,
      };

    beforeEach(() => {
      fetch.once(JSON.stringify(responseBody));
    });

    it('returns the response body', async () => {
      const response = await client.changePassword(params);
      expect(response).toEqual(responseBody);
    });

    it('maps the form values to api', async () => {
      await client.changePassword(params);
      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ body: JSON.stringify(responseBody) }),
      );
    });
  });

  describe('resetPasswordRequest', () => {
    it('Returns the response body', async () => {
      const body = { email: 'test@test.com' };
      fetch.once(JSON.stringify(body));
      const response = await client.resetPasswordRequest(body);
      expect(response).toEqual(body);
    });
  });

  describe('resetPasswordVerify', () => {
    const params = {
        newPassword: 'pandacon',
        newPasswordConfirm: 'pandacon',
        uid: '123',
        token: 'wkefnwon',
      },
      body = {
        email: 'test@test.com',
      };
    it('Returns the response body', async () => {
      fetch.doMockIf(/verify-reset/, JSON.stringify(body));
      const response = await client.resetPasswordVerify(params);
      expect(response).toEqual(body);
    });

    it('Maps the params to the api', () => {
      fetch.once(JSON.stringify(body));
      client.resetPasswordVerify(params);
      expect(fetch).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          body: JSON.stringify({
            new_password1: params.newPassword,
            new_password2: params.newPasswordConfirm,
            uid: params.uid,
            token: params.token,
          }),
        }),
      );
    });
  });
});
