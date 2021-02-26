import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Accounts from '.';
import {
  CONFIRM_EMAIL,
  LOGIN,
  PASSWORD_RESET,
  PASSWORD_RESET_REQUEST,
  REGISTER,
  REGISTER_CUSTOMER,
  REGISTER_CUSTOMER_ORDER,
  REGISTER_CUSTOMER_USER,
  RESEND,
} from './accounts.constants';
import { resendVerificationEmail } from './accounts.slice';

const mockStore = configureMockStore([thunk]);

const renderComponent = (initialEntries = ['']) => {
  const store = mockStore({
    app: { apiUrl: '' },
    accounts: { user: { email: 'test@test.com' } },
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

  it(`Shows CustomerRegistration when route is ${REGISTER_CUSTOMER}`, async () => {
    const { getAllByRole } = renderComponent([REGISTER_CUSTOMER]);
    await waitFor(() =>
      expect(getAllByRole('textbox').length).toBeGreaterThanOrEqual(1),
    );
  });

  it(`Shows UserRegistration when route is ${REGISTER_CUSTOMER_USER}`, async () => {
    const { getAllByRole } = renderComponent([REGISTER_CUSTOMER_USER]);
    await waitFor(() =>
      expect(getAllByRole('textbox').length).toBeGreaterThanOrEqual(1),
    );
  });

  it(`Shows OrderForm when route is ${REGISTER_CUSTOMER_ORDER}`, async () => {
    const { getAllByRole } = renderComponent([REGISTER_CUSTOMER_ORDER]);
    await waitFor(() =>
      expect(getAllByRole('textbox').length).toBeGreaterThanOrEqual(1),
    );
  });

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

  it(`Shows PasswordResetRequest when route is ${PASSWORD_RESET_REQUEST}`, async () => {
    const { getAllByRole } = renderComponent([PASSWORD_RESET_REQUEST]);
    await waitFor(() => expect(getAllByRole('textbox').length).toBe(1));
  });

  it(`Shows PasswordResetForm when route is ${PASSWORD_RESET}`, async () => {
    const { getByRole } = renderComponent([PASSWORD_RESET]);
    await waitFor(() =>
      expect(
        getByRole('button', { name: 'Reset Password' }),
      ).toBeInTheDocument(),
    );
  });

  describe(`${RESEND}`, () => {
    it(`Shows ResendVerificationEmail when route is ${RESEND}`, () => {
      const { getByRole } = renderComponent([RESEND]);
      expect(getByRole('button', { name: 'Resend email' })).toBeInTheDocument();
    });

    it(`dispatches ${resendVerificationEmail.name} action when button is clicked`, () => {
      const { getByRole, store } = renderComponent([RESEND]);
      userEvent.click(getByRole('button', { name: 'Resend email' }));
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ...resendVerificationEmail('test@test.com'),
          }),
        ]),
      );
    });
  });
});
