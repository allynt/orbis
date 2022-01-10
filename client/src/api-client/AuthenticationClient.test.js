import { rest } from 'msw';

import { server } from 'mocks/server';

import { AuthenticationClient } from './AuthenticationClient';

describe('AuthenticationClient', () => {
  /** @type {AuthenticationClient} */
  let client;

  beforeEach(() => {
    client = new AuthenticationClient();
  });

  describe('login', () => {
    it('Returns the login response', async () => {
      const responseBody = {
        id: '5edd4615-34a7-4c55-9243-0092671ef9d8',
        email: 'user@test.com',
        customers: [],
        description: '',
        is_approved: true,
        is_verified: true,
        name: null,
        orbs: [{ features: ['satellites'] }],
        password: 'user',
        profiles: {},
        roles: ['UserRole', 'AstrosatRole'],
        username: 'user@test.com',
      };

      const response = await client.login({
        email: 'user@test.com',
        password: 'user',
        accepted_terms: true,
      });

      expect(response).toEqual(responseBody);
    });
  });

  describe('logout', () => {
    it('makes the logout call', async () => {
      const response = await client.logout();

      expect(response).toEqual({
        token: '57bd67287664bb1497cb29fe89d2d5087195a3ae',
      });
    });
  });

  describe('registerUser', () => {
    const formValues = {
      email: 'test@test.com',
      newPassword: 'pandacon',
      newPasswordConfirm: 'pandacon',
      acceptedTerms: true,
      registration_stage: 'CUSTOMER',
      // },
      // returnedUser = {
      //   email: 'test@test.com',
      //   name: 'Test User',
    };

    it('Returns the partial user', async () => {
      const response = await client.registerUser(formValues);
      expect(response).toEqual({
        token: '57bd67287664bb1497cb29fe89d2d5087195a3ae',
      });
    });

    // it('Converts the input data to match the api', async () => {
    //   await client.registerUser(formValues);

    //   expect(fetch).toHaveBeenCalledWith(
    //     expect.anything(),
    //     expect.objectContaining({
    //       body: JSON.stringify({
    //         email: formValues.email,
    //         password1: formValues.newPassword,
    //         password2: formValues.newPasswordConfirm,
    //         accepted_terms: formValues.acceptedTerms,
    //         registration_stage: formValues.registration_stage,
    //       }),
    //     }),
    //   );
    // });
  });

  describe('verifyEmail', () => {
    it('Returns the user from the response', async () => {
      const user = { email: 'test@test.com', name: 'Test User' };

      const response = await client.verifyEmail({ key: '123' });

      expect(response).toEqual(user);
    });
  });

  describe('sendVerificationEmail', () => {
    it('Returns the email from the response', async () => {
      const email = 'test@test.com';
      const otherEmail = 'test@other.com';

      const response = await client.sendVerificationEmail({ email });

      expect(response).toEqual({ email: otherEmail });
    });
  });

  describe('changePassword', () => {
    const params = {
        oldPassword: 'user',
        newPassword: 'pandacon',
        newPasswordConfirm: 'pandacon',
      },
      responseBody = {
        new_password1: params.newPassword,
        new_password2: params.newPasswordConfirm,
      };

    it('returns the response body', async () => {
      server.use(
        rest.post('*/api/authentication/password/change/', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(responseBody));
        }),
      );

      const response = await client.changePassword(params);

      expect(response).toEqual(responseBody);
    });

    // it('maps the form values to api', async () => {
    //   await client.changePassword(params);

    //   expect(fetch).toHaveBeenCalledWith(
    //     expect.anything(),
    //     expect.objectContaining({ body: JSON.stringify(responseBody) }),
    //   );
    // });
  });

  describe('resetPasswordRequest', () => {
    it('Returns the response body', async () => {
      const body = { email: 'test@test.com' };

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
      const response = await client.resetPasswordVerify(params);

      expect(response).toEqual(body);
    });

    // it('Maps the params to the api', async () => {
    //   await client.resetPasswordVerify(params);

    //   expect(fetch).toBeCalledWith(
    //     expect.anything(),
    //     expect.objectContaining({
    //       body: JSON.stringify({
    //         new_password1: params.newPassword,
    //         new_password2: params.newPasswordConfirm,
    //         uid: params.uid,
    //         token: params.token,
    //       }),
    //     }),
    //   );
    // });
  });
});
