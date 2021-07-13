import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { MemoryRouter, Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

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
  changePasswordSuccess,
  confirmResetPassword,
  passwordResetRequestedSuccess,
  registerCustomer,
  registerCustomerSuccess,
  resendVerificationEmail,
  resendVerificationEmailSuccess,
  registerUser,
  registerUserSuccess,
  resetPassword,
  resetPasswordSuccess,
  placeOrder,
  placeOrderSuccess,
  login,
  loginUserSuccess,
} from './accounts.slice';

import Accounts from '.';

const mockStore = configureMockStore([thunk]);

const renderComponent = (initialEntries = ['']) => {
  const store = mockStore({
    app: {
      config: {
        passwordMinLength: 0,
        passwordMaxLength: 255,
        passwordStrength: 1,
      },
    },
    accounts: { user: { email: 'test@test.com', customers: [] } },
    admin: {},
  });
  const utils = render(<Accounts />, {
    wrapper: ({ children }) => (
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </Provider>
    ),
  });
  return { store, ...utils };
};

describe('Accounts index', () => {
  it(`Shows journey selection when route is ${REGISTER}`, async () => {
    const { getAllByRole } = renderComponent([REGISTER]);
    await waitFor(() =>
      expect(getAllByRole('radio').length).toBeGreaterThanOrEqual(1),
    );
  });

  describe(`${REGISTER_CUSTOMER}`, () => {
    it(`Shows CustomerRegistration when route is ${REGISTER_CUSTOMER}`, async () => {
      const { getAllByRole } = renderComponent([REGISTER_CUSTOMER]);
      await waitFor(() =>
        expect(getAllByRole('textbox').length).toBeGreaterThanOrEqual(1),
      );
    });

    it(`dispatches ${registerCustomer.name} when submitted`, async () => {
      fetch.mockResponse(JSON.stringify({}));
      const { getByRole, store } = renderComponent([REGISTER_CUSTOMER]);
      userEvent.type(
        getByRole('textbox', { name: /organisation\sname/i }),
        'Test Company',
      );
      userEvent.click(getByRole('button', { name: /next/i }));
      await waitFor(() =>
        expect(store.getActions()).toEqual(
          expect.arrayContaining([registerCustomerSuccess()]),
        ),
      );
    });
  });

  describe(`${REGISTER_CUSTOMER_USER}`, () => {
    it(`Shows UserRegistration when route is ${REGISTER_CUSTOMER_USER}`, async () => {
      const { getAllByRole } = renderComponent([REGISTER_CUSTOMER_USER]);
      await waitFor(() =>
        expect(getAllByRole('textbox').length).toBeGreaterThanOrEqual(1),
      );
    });

    it(`dispatches ${registerUser.name} action when submitted`, async () => {
      const { getByRole, getByLabelText, store } = renderComponent([
        REGISTER_CUSTOMER_USER,
      ]);
      userEvent.type(getByRole('textbox', { name: /email/i }), 'test@test.com');
      userEvent.type(getByRole('textbox', { name: /first/i }), 'John');
      userEvent.type(getByRole('textbox', { name: /last/i }), 'Smith');
      userEvent.type(
        getByRole('textbox', { name: /organisation\sname/i }),
        'Weyland-Yutani',
      );
      userEvent.type(getByLabelText(/password \*/i), 'pandaconcretespoon');
      userEvent.type(
        getByLabelText(/password\sconfirmation/i),
        'pandaconcretespoon',
      );
      userEvent.click(getByRole('checkbox'));
      userEvent.click(getByRole('button', { name: /sign\sup/i }));
      await waitFor(() =>
        expect(store.getActions()).toEqual(
          expect.arrayContaining([registerUserSuccess({})]),
        ),
      );
    });
  });

  describe(`${REGISTER_CUSTOMER_ORDER}`, () => {
    it(`Shows OrderForm when route is ${REGISTER_CUSTOMER_ORDER}`, async () => {
      const { getAllByRole } = renderComponent([REGISTER_CUSTOMER_ORDER]);
      await waitFor(() =>
        expect(getAllByRole('textbox').length).toBeGreaterThanOrEqual(1),
      );
    });

    it(`dispatches ${placeOrder.name} action when submitted`, async () => {
      const { getByRole, store } = renderComponent([REGISTER_CUSTOMER_ORDER]);
      userEvent.click(getByRole('checkbox'));
      userEvent.click(getByRole('button'));
      await waitFor(() => {
        expect(store.getActions()).toEqual(
          expect.arrayContaining([placeOrderSuccess()]),
        );
      });
    });
  });

  describe(`${LOGIN}`, () => {
    it.each([LOGIN, CONFIRM_EMAIL])(
      `Shows LoginForm when route is %s`,
      async path => {
        fetch.once(JSON.stringify({}));
        const { getAllByRole } = renderComponent([path]);
        await waitFor(() =>
          expect(getAllByRole('textbox').length).toBeGreaterThanOrEqual(1),
        );
      },
    );

    it('Redirects to root if user is logged in, is verified, and registration stage is falsy', () => {
      const store = mockStore({
        accounts: { user: { is_verified: true }, userKey: '123' },
      });
      const history = createMemoryHistory({ initialEntries: [LOGIN] });
      render(<Accounts />, {
        wrapper: ({ children }) => (
          <Provider store={store}>
            <Router history={history}>{children}</Router>
          </Provider>
        ),
      });
      expect(history.location.pathname).toBe('/');
    });

    it(`dispatches ${login.name} action when submitted`, async () => {
      const { getByRole, getByLabelText, store } = renderComponent([LOGIN]);
      userEvent.type(getByRole('textbox', { name: /email/i }), 'test@test.com');
      userEvent.type(getByLabelText(/password \*/i), 'pandaconcretespoon');
      userEvent.click(getByRole('button', { name: /login/i }));
      await waitFor(() =>
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            loginUserSuccess(expect.objectContaining({})),
          ]),
        ),
      );
    });
  });

  describe(`${PASSWORD_CHANGE}`, () => {
    it(`dispatches ${changePassword.name} action when submitted`, async () => {
      const { getByLabelText, getByRole, store } = renderComponent([
        PASSWORD_CHANGE,
      ]);
      userEvent.type(getByLabelText(/old\spassword/i), 'thisisanoldpassword');
      userEvent.type(getByLabelText(/new\spassword$/i), 'thisismynewpassword');
      userEvent.type(
        getByLabelText(/new\spassword\sconfirmation/i),
        'thisismynewpassword',
      );
      userEvent.click(getByRole('checkbox'));
      userEvent.click(getByRole('button', { name: /change\spassword/i }));
      await waitFor(() =>
        expect(store.getActions()).toEqual(
          expect.arrayContaining([changePasswordSuccess()]),
        ),
      );
    });
  });

  describe(`${PASSWORD_RESET_REQUEST}`, () => {
    it(`Shows PasswordResetRequest when route is ${PASSWORD_RESET_REQUEST}`, async () => {
      const { getAllByRole } = renderComponent([PASSWORD_RESET_REQUEST]);
      await waitFor(() => expect(getAllByRole('textbox').length).toBe(1));
    });

    it(`dispatches ${resetPassword.name} action when submitted`, async () => {
      fetch.once(JSON.stringify({}));
      const { getByRole, store } = renderComponent([PASSWORD_RESET_REQUEST]);
      userEvent.type(getByRole('textbox'), 'test@test.com');
      userEvent.click(getByRole('button'));
      await waitFor(() =>
        expect(store.getActions()).toEqual(
          expect.arrayContaining([resetPasswordSuccess()]),
        ),
      );
    });
  });

  describe(`${PASSWORD_RESET}`, () => {
    it(`Shows PasswordResetForm when route is ${PASSWORD_RESET}`, async () => {
      const { getByRole } = renderComponent([PASSWORD_RESET]);
      await waitFor(() =>
        expect(
          getByRole('button', { name: 'Reset Password' }),
        ).toBeInTheDocument(),
      );
    });

    it(`dispatches the ${confirmResetPassword.name} action when filled out correctly`, async () => {
      fetch.once(JSON.stringify({}));
      const { getByRole, getByLabelText, store } = renderComponent([
        PASSWORD_RESET,
      ]);
      userEvent.type(getByLabelText(/new\spassword$/i), 'pandaconcretespoon');
      userEvent.type(
        getByLabelText(/new\spassword\sconfirmation/i),
        'pandaconcretespoon',
      );
      userEvent.click(getByRole('button', { name: /reset\spassword/i }));
      await waitFor(() =>
        expect(store.getActions()).toEqual(
          expect.arrayContaining([passwordResetRequestedSuccess()]),
        ),
      );
    });
  });

  describe(`${RESEND}`, () => {
    it(`Shows ResendVerificationEmail when route is ${RESEND}`, () => {
      const { getByRole } = renderComponent([RESEND]);
      expect(getByRole('button', { name: 'Resend email' })).toBeInTheDocument();
    });

    it(`dispatches ${resendVerificationEmail.name} action when button is clicked`, async () => {
      const { getByRole, store } = renderComponent([RESEND]);
      userEvent.click(getByRole('button', { name: 'Resend email' }));
      await waitFor(() =>
        expect(store.getActions()).toEqual(
          expect.arrayContaining([resendVerificationEmailSuccess()]),
        ),
      );
    });
  });
});
