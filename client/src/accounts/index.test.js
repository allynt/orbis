import React from 'react';

import fetchMock from 'jest-fetch-mock';

import { render, screen, waitFor, userEvent } from 'test/test-utils';

import {
  CONFIRM_EMAIL,
  LOGIN,
  PASSWORD_CHANGE,
  PASSWORD_RESET,
  PASSWORD_RESET_REQUEST,
  REGISTER,
  REGISTER_CUSTOMER,
  REGISTER_CUSTOMER_ORDER,
  REGISTER_CUSTOMER_USER,
  RESEND,
} from './accounts.constants';
import {
  changePassword,
  resetPasswordConfirm,
  registerCustomer,
  resendVerificationEmail,
  registerUser,
  resetPasswordRequest,
  placeOrder,
  login,
} from './accounts.slice';

import Accounts from '.';

const setup = (initialEntries = [''], state) => {
  const defaultState = {
    app: {
      config: {
        passwordMinLength: 0,
        passwordMaxLength: 255,
        passwordStrength: 1,
      },
    },
    accounts: { user: { email: 'test@test.com', customers: [] } },
    missionControl: {},
  };

  return render(<Accounts />, {
    state: state ? state : defaultState,
    history: { initialEntries },
  });
};

fetchMock.enableMocks();

describe('Accounts index', () => {
  it(`Shows journey selection when route is ${REGISTER}`, async () => {
    setup([REGISTER]);

    await waitFor(() =>
      expect(screen.getAllByRole('radio').length).toBeGreaterThanOrEqual(1),
    );
  });

  describe(`${REGISTER_CUSTOMER}`, () => {
    it(`Shows CustomerRegistration when route is ${REGISTER_CUSTOMER}`, async () => {
      setup([REGISTER_CUSTOMER]);

      await waitFor(() =>
        expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(1),
      );
    });

    it(`dispatches ${registerCustomer.name} when submitted`, async () => {
      fetchMock.mockResponse(JSON.stringify({}));
      const { store } = setup([REGISTER_CUSTOMER]);

      userEvent.type(
        screen.getByRole('textbox', { name: /organisation\sname/i }),
        'Test Company',
      );

      userEvent.click(screen.getByRole('button', { name: /next/i }));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual(
          expect.objectContaining({ type: registerCustomer.fulfilled.type }),
        ),
      );
    });
  });

  describe(`${REGISTER_CUSTOMER_USER}`, () => {
    it(`Shows UserRegistration when route is ${REGISTER_CUSTOMER_USER}`, async () => {
      setup([REGISTER_CUSTOMER_USER]);

      await waitFor(() =>
        expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(1),
      );
    });

    it(`dispatches ${registerUser.typePrefix} action when submitted`, async () => {
      const { store } = setup([REGISTER_CUSTOMER_USER]);

      userEvent.type(
        screen.getByRole('textbox', { name: /email/i }),
        'test@test.com',
      );
      userEvent.type(screen.getByRole('textbox', { name: /first/i }), 'John');
      userEvent.type(screen.getByRole('textbox', { name: /last/i }), 'Smith');
      userEvent.type(
        screen.getByRole('textbox', { name: /organisation\sname/i }),
        'Weyland-Yutani',
      );
      userEvent.type(
        screen.getByLabelText(/password \*/i),
        'pandaconcretespoon',
      );
      userEvent.type(
        screen.getByLabelText(/password\sconfirmation/i),
        'pandaconcretespoon',
      );
      userEvent.click(screen.getByRole('checkbox'));
      userEvent.click(screen.getByRole('button', { name: /sign\sup/i }));

      await waitFor(() =>
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ type: registerUser.fulfilled.type }),
          ]),
        ),
      );
    });
  });

  describe(`${REGISTER_CUSTOMER_ORDER}`, () => {
    it(`Shows OrderForm when route is ${REGISTER_CUSTOMER_ORDER}`, async () => {
      setup([REGISTER_CUSTOMER_ORDER]);

      await waitFor(() =>
        expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(1),
      );
    });

    it(`dispatches ${placeOrder.name} action when submitted`, async () => {
      const { store } = setup([REGISTER_CUSTOMER_ORDER]);

      userEvent.click(screen.getByRole('checkbox'));
      userEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(store.getActions()).toContainEqual(
          expect.objectContaining({ type: placeOrder.fulfilled.type }),
        );
      });
    });
  });

  describe(`${LOGIN}`, () => {
    it.each([LOGIN, CONFIRM_EMAIL])(
      `Shows LoginForm when route is %s`,
      async path => {
        fetchMock.once(JSON.stringify({}));
        setup([path]);

        await waitFor(() =>
          expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(
            1,
          ),
        );
      },
    );

    it('Redirects to root if user is logged in, is verified, and registration stage is falsy', () => {
      const state = {
        accounts: { user: { is_verified: true }, userKey: '123' },
      };

      const { history } = setup([LOGIN], state);

      expect(history.location.pathname).toBe('/');
    });

    it(`dispatches ${login.fulfilled.type} action when submitted`, async () => {
      const { store } = setup([LOGIN]);

      userEvent.type(
        screen.getByRole('textbox', { name: /email/i }),
        'test@test.com',
      );
      userEvent.type(
        screen.getByLabelText(/password \*/i),
        'pandaconcretespoon',
      );
      userEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual(
          expect.objectContaining({ type: login.fulfilled.type }),
        ),
      );
    });
  });

  describe(`${PASSWORD_CHANGE}`, () => {
    it(`dispatches ${changePassword.fulfilled.type} action when submitted`, async () => {
      const { store } = setup([PASSWORD_CHANGE]);

      userEvent.type(
        screen.getByLabelText(/old\spassword/i),
        'thisisanoldpassword',
      );
      userEvent.type(
        screen.getByLabelText(/new\spassword$/i),
        'thisismynewpassword',
      );
      userEvent.type(
        screen.getByLabelText(/new\spassword\sconfirmation/i),
        'thisismynewpassword',
      );
      userEvent.click(screen.getByRole('checkbox'));
      userEvent.click(
        screen.getByRole('button', { name: /change\spassword/i }),
      );

      await waitFor(() =>
        expect(store.getActions()).toContainEqual(
          expect.objectContaining({ type: changePassword.fulfilled.type }),
        ),
      );
    });
  });

  describe(`${PASSWORD_RESET_REQUEST}`, () => {
    it(`Shows PasswordResetRequest when route is ${PASSWORD_RESET_REQUEST}`, async () => {
      setup([PASSWORD_RESET_REQUEST]);

      await waitFor(() =>
        expect(screen.getAllByRole('textbox').length).toBe(1),
      );
    });

    it(`dispatches ${resetPasswordRequest.fulfilled.type} action when submitted`, async () => {
      fetchMock.once(JSON.stringify({}));
      const { store } = setup([PASSWORD_RESET_REQUEST]);

      userEvent.type(screen.getByRole('textbox'), 'test@test.com');
      userEvent.click(screen.getByRole('button'));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual(
          expect.objectContaining({
            type: resetPasswordRequest.fulfilled.type,
          }),
        ),
      );
    });
  });

  describe(`${PASSWORD_RESET}`, () => {
    it(`Shows PasswordResetForm when route is ${PASSWORD_RESET}`, async () => {
      setup([PASSWORD_RESET]);

      await waitFor(() =>
        expect(
          screen.getByRole('button', { name: 'Reset Password' }),
        ).toBeInTheDocument(),
      );
    });

    it(`dispatches the ${resetPasswordConfirm.fulfilled.type} action when filled out correctly`, async () => {
      fetchMock.once(JSON.stringify({}));
      const { store } = setup([PASSWORD_RESET]);

      userEvent.type(
        screen.getByLabelText(/new\spassword$/i),
        'pandaconcretespoon',
      );
      userEvent.type(
        screen.getByLabelText(/new\spassword\sconfirmation/i),
        'pandaconcretespoon',
      );
      userEvent.click(screen.getByRole('button', { name: /reset\spassword/i }));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual(
          expect.objectContaining({
            type: resetPasswordConfirm.fulfilled.type,
          }),
        ),
      );
    });
  });

  describe(`${RESEND}`, () => {
    it(`Shows ResendVerificationEmail when route is ${RESEND}`, () => {
      setup([RESEND]);

      expect(
        screen.getByRole('button', { name: 'Resend email' }),
      ).toBeInTheDocument();
    });

    it(`dispatches ${resendVerificationEmail.fulfilled.type} action when button is clicked`, async () => {
      const { store } = setup([RESEND]);

      userEvent.click(screen.getByRole('button', { name: 'Resend email' }));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual(
          expect.objectContaining({
            type: resendVerificationEmail.fulfilled.type,
          }),
        ),
      );
    });
  });
});
