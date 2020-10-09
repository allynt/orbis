import React from 'react';

import { render, waitFor } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import PasswordResetConfirmForm from './password-reset-confirm-form.component';
import { status } from 'accounts/accounts.slice';

const mockStore = configureMockStore([thunk]);

const PASSWORD_PLACEHOLDER_TEXT = 'New Password';
const PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT = 'New Password Confirmation';
const RESET_BUTTON_TEXT = 'Reset Password';
const PASSWORD_TEXT = 'newpassword';
const I_AGREE_TEXT = 'I agree with';

const renderComponent = (
  store,
  confirmResetPassword,
  resetStatus,
  match,
  error,
) =>
  render(
    <PasswordResetConfirmForm
      confirmResetPassword={confirmResetPassword}
      resetStatus={resetStatus}
      match={match}
      error={error}
    />,
    {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    },
  );

describe('Password Reset Form Component', () => {
  let store;
  let confirmResetPassword = null;
  let resetStatus = null;
  let match = null;
  let error = null;

  beforeEach(() => {
    store = mockStore({
      app: { config: { passwordMinLength: 2, passwordMaxLength: 50 } },
    });

    confirmResetPassword = jest.fn();
    resetStatus = status.NONE;
    match = {
      params: {
        uid: 'Test UID',
        token: 'Test Token',
      },
    };
    error = null;
  });

  it('should render a form', () => {
    const { getByText, getByPlaceholderText } = renderComponent(
      store,
      confirmResetPassword,
      resetStatus,
      match,
      error,
    );

    expect(getByPlaceholderText(PASSWORD_PLACEHOLDER_TEXT)).toBeInTheDocument();
    expect(
      getByPlaceholderText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
    ).toBeInTheDocument();
    // Check form submit button
    expect(getByText(RESET_BUTTON_TEXT)).toBeInTheDocument();
    // Check Terms and Conditions checkbox
    expect(getByText(I_AGREE_TEXT)).toBeInTheDocument();
    // Check link to login view
    expect(getByText('Login')).toBeInTheDocument();
    expect(getByText(RESET_BUTTON_TEXT)).toHaveAttribute('disabled');
  });

  it('should disable `Reset Password` button when form is invalid', () => {
    const { getByText, getByPlaceholderText } = renderComponent(
      store,
      confirmResetPassword,
      resetStatus,
      match,
      error,
    );

    const password = getByPlaceholderText(PASSWORD_PLACEHOLDER_TEXT);
    expect(password.value).toEqual('');
    userEvent.type(password, PASSWORD_TEXT);
    expect(password.value).toEqual(PASSWORD_TEXT);
    expect(getByText(RESET_BUTTON_TEXT)).toHaveAttribute('disabled');
  });

  it('should enable `Reset Password` button when form is valid', () => {
    const { getByText, getByPlaceholderText } = renderComponent(
      store,
      confirmResetPassword,
      resetStatus,
      match,
      error,
    );

    let password = getByPlaceholderText(PASSWORD_PLACEHOLDER_TEXT);
    userEvent.type(password, PASSWORD_TEXT);
    expect(password.value).toEqual(PASSWORD_TEXT);

    password = getByPlaceholderText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT);
    userEvent.type(password, PASSWORD_TEXT);
    expect(password.value).toEqual(PASSWORD_TEXT);
    waitFor(() => getByText(I_AGREE_TEXT));

    expect(getByText(RESET_BUTTON_TEXT)).toHaveAttribute('disabled');
    userEvent.click(getByText(I_AGREE_TEXT));

    expect(getByText(RESET_BUTTON_TEXT)).not.toHaveAttribute('disabled');
  });

  it('should not call `confirmResetPassword` function when form is invalid and `Reset Password` button clicked', async () => {
    const { getByText, getByPlaceholderText } = renderComponent(
      store,
      confirmResetPassword,
      resetStatus,
      match,
      error,
    );

    userEvent.type(getByPlaceholderText(PASSWORD_PLACEHOLDER_TEXT), 'te');

    waitFor(async () => await userEvent.tab());

    userEvent.click(getByText(RESET_BUTTON_TEXT));
    expect(confirmResetPassword).not.toHaveBeenCalled();
  });

  it('should call `confirmResetPassword` function when form is valid and `Reset Password` button clicked', async () => {
    const { getByRole, getByText, getByPlaceholderText } = renderComponent(
      store,
      confirmResetPassword,
      resetStatus,
      match,
      error,
    );

    userEvent.type(
      getByPlaceholderText(PASSWORD_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );
    userEvent.type(
      getByPlaceholderText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );

    userEvent.click(getByText(I_AGREE_TEXT));
    userEvent.click(getByRole('button', { name: RESET_BUTTON_TEXT }));

    await waitFor(() =>
      expect(confirmResetPassword).toHaveBeenCalledWith(
        {
          new_password1: PASSWORD_TEXT,
          new_password2: PASSWORD_TEXT,
          termsAgreed: true,
        },
        { token: 'Test Token', uid: 'Test UID' },
      ),
    );
  });

  it('should display error well if password reset is unsuccessful', () => {
    resetStatus = status.NONE;
    error = ['Test Error 1', 'Test Error 2', 'Test Error 3'];

    const { getByTestId } = renderComponent(
      store,
      confirmResetPassword,
      resetStatus,
      match,
      error,
    );

    expect(getByTestId('error-well')).toBeInTheDocument();
  });

  describe('Password Reset Success View', () => {
    it('should show the Password Reset success view', () => {
      const { getByText } = renderComponent(
        store,
        confirmResetPassword,
        status.COMPLETE,
        match,
        error,
      );

      expect(
        getByText(
          'Your password has successfully been reset. Click the button to continue.',
        ),
      ).toBeInTheDocument();

      expect(getByText('Continue')).toBeInTheDocument();
    });
  });
});
