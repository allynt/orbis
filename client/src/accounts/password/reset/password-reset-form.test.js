import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { status } from 'accounts/accounts.slice';
import { FIELD_NAMES } from 'utils/validators';

import PasswordResetForm from './password-reset-form.component';

const mockStore = configureMockStore([thunk]);

const PASSWORD_PLACEHOLDER_TEXT = 'New Password';
const PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT = 'New Password Confirmation';
const RESET_BUTTON_TEXT = 'Reset Password';
const PASSWORD_TEXT = 'newpassword';

const renderComponent = (
  store,
  confirmResetPassword,
  resetStatus,
  match,
  error,
) =>
  render(
    <PasswordResetForm
      confirmResetPassword={confirmResetPassword}
      resetStatus={resetStatus}
      match={match}
      error={error}
      passwordMinLength={2}
      passwordMaxLength={30}
      passwordStrength={0}
    />,
    {
      wrapper: ({ children }) => (
        <Provider store={store}>
          <Router history={createMemoryHistory()}>{children}</Router>
        </Provider>
      ),
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
    const { getByText, getByLabelText } = renderComponent(
      store,
      confirmResetPassword,
      resetStatus,
      match,
      error,
    );

    expect(getByLabelText(PASSWORD_PLACEHOLDER_TEXT)).toBeInTheDocument();
    expect(
      getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
    ).toBeInTheDocument();
    // Check form submit button
    expect(getByText(RESET_BUTTON_TEXT)).toBeInTheDocument();
    // Check link to login view
    expect(getByText('Login')).toBeInTheDocument();
  });

  it('should disable `Reset Password` button when form is invalid', async () => {
    const { getByRole } = renderComponent(
      store,
      confirmResetPassword,
      resetStatus,
      match,
      error,
    );
    userEvent.click(getByRole('button', { name: RESET_BUTTON_TEXT }));
    await waitFor(() =>
      expect(getByRole('button', { name: RESET_BUTTON_TEXT })).toBeDisabled(),
    );
  });

  it('should enable `Reset Password` button when form is valid', async () => {
    const { getByRole, getByLabelText } = renderComponent(
      store,
      confirmResetPassword,
      resetStatus,
      match,
      error,
    );
    userEvent.type(getByLabelText(PASSWORD_PLACEHOLDER_TEXT), PASSWORD_TEXT);
    userEvent.type(
      getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );
    await waitFor(() =>
      expect(
        getByRole('button', { name: RESET_BUTTON_TEXT }),
      ).not.toBeDisabled(),
    );
  });

  it('should not call `confirmResetPassword` function when form is invalid and `Reset Password` button clicked', () => {
    const { getByText, getByLabelText } = renderComponent(
      store,
      confirmResetPassword,
      resetStatus,
      match,
      error,
    );

    userEvent.type(getByLabelText(PASSWORD_PLACEHOLDER_TEXT), 'te');

    userEvent.tab();

    userEvent.click(getByText(RESET_BUTTON_TEXT));
    expect(confirmResetPassword).not.toHaveBeenCalled();
  });

  it('should call `confirmResetPassword` function when form is valid and `Reset Password` button clicked', async () => {
    const { getByRole, getByLabelText } = renderComponent(
      store,
      confirmResetPassword,
      resetStatus,
      match,
      error,
    );

    userEvent.type(getByLabelText(PASSWORD_PLACEHOLDER_TEXT), PASSWORD_TEXT);
    userEvent.type(
      getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );

    userEvent.click(getByRole('button', { name: RESET_BUTTON_TEXT }));

    await waitFor(() =>
      expect(confirmResetPassword).toHaveBeenCalledWith(
        {
          [FIELD_NAMES.newPassword]: PASSWORD_TEXT,
          [FIELD_NAMES.newPasswordConfirm]: PASSWORD_TEXT,
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
