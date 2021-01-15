import React from 'react';

import { render, waitFor } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import PasswordResetRequestForm from './password-reset-request-form.component';
import { status } from '../../accounts.slice';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

const RESET_BUTTON_TEXT = 'Reset Password';

const renderComponent = (resetPassword, resetStatus, error) =>
  render(
    <Router history={createMemoryHistory()}>
      <PasswordResetRequestForm
        resetPassword={resetPassword}
        resetStatus={resetStatus}
        error={error}
      />
    </Router>,
  );

describe('Password Reset Request Form Component', () => {
  let resetPassword = null;
  let resetStatus = null;
  let error = null;

  beforeEach(() => {
    resetPassword = jest.fn();
    resetStatus = status.NONE;
    error = [];
  });

  it('should render a form', () => {
    const { getByText, getByRole } = renderComponent(
      resetPassword,
      resetStatus,
      error,
    );

    expect(getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
    const resetButton = getByRole('button', { name: RESET_BUTTON_TEXT });
    expect(resetButton).toBeInTheDocument();
    expect(resetButton).toHaveAttribute('disabled');
    expect(getByText('Do you have an account?')).toBeInTheDocument();
    expect(getByText('Login')).toBeInTheDocument();
  });

  it('should disable `Reset Password` button when Email too short', async () => {
    const { getByRole } = renderComponent(resetPassword, resetStatus, error);

    const resetButton = getByRole('button', { name: RESET_BUTTON_TEXT });
    expect(resetButton).toHaveAttribute('disabled');
    userEvent.type(getByRole('textbox', { name: 'Email' }), 't');

    userEvent.tab();

    await waitFor(() => {
      expect(resetButton).toHaveAttribute('disabled');
    });
  });

  it('should disable `Reset Password` button when Email invalid', async () => {
    const { getByRole } = renderComponent(resetPassword, resetStatus, error);

    const resetButton = getByRole('button', { name: RESET_BUTTON_TEXT });
    expect(resetButton).toHaveAttribute('disabled');
    userEvent.type(getByRole('textbox', { name: 'Email' }), 'testtest.com');

    userEvent.tab();

    await waitFor(() => {
      expect(resetButton).toHaveAttribute('disabled');
    });
  });

  it('should enable `Reset Password` button when form is valid', async () => {
    const { getByRole } = renderComponent(resetPassword, resetStatus, error);

    expect(getByRole('button', { name: RESET_BUTTON_TEXT })).toBeDisabled();
    userEvent.type(getByRole('textbox', { name: 'Email' }), 'test@test.com');

    await waitFor(() =>
      expect(
        getByRole('button', { name: RESET_BUTTON_TEXT }),
      ).not.toBeDisabled(),
    );
  });

  it.each(['', 't', 'testtest.com', 'test@test.'])(
    'should not call resetPassword function when email is %s and `Reset Password` button clicked',
    email => {
      const { getByRole } = renderComponent(resetPassword, resetStatus, error);

      userEvent.type(getByRole('textbox', { name: 'Email' }), email);

      userEvent.tab();

      userEvent.click(getByRole('button', { name: RESET_BUTTON_TEXT }));

      expect(resetPassword).not.toHaveBeenCalled();
    },
  );

  it('should call resetPassword function when form is valid and `Reset Password` button clicked', async () => {
    const { getByRole } = renderComponent(resetPassword, resetStatus, error);

    const EMAIL_TEXT = 'test@test.com';
    userEvent.type(getByRole('textbox', { name: 'Email' }), EMAIL_TEXT);

    userEvent.click(getByRole('button', { name: RESET_BUTTON_TEXT }));

    await waitFor(() =>
      expect(resetPassword).toHaveBeenCalledWith({ email: EMAIL_TEXT }),
    );
  });

  it('should display error well if password reset is unsuccessful', () => {
    error = ['Test Error 1', 'Test Error 2', 'Test Error 3'];

    const { getByTestId } = renderComponent(resetPassword, status.NONE, error);

    expect(getByTestId('error-well')).toBeInTheDocument();
  });

  describe('Password Reset Success View', () => {
    it('should show the Password Change success view', () => {
      const { getByText } = renderComponent(
        resetPassword,
        status.PENDING,
        error,
      );

      expect(getByText('Check your email')).toBeInTheDocument();

      expect(getByText('Return to login')).toBeInTheDocument();
    });
  });
});
