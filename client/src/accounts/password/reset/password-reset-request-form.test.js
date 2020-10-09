import React from 'react';

import { render, waitFor } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import PasswordResetForm from './password-reset-request-form.component';
import { status } from '../../accounts.slice';

const RESET_BUTTON_TEXT = 'Reset Password';

const renderComponent = (resetPassword, resetStatus, error) =>
  render(
    <PasswordResetForm
      resetPassword={resetPassword}
      resetStatus={resetStatus}
      error={error}
    />,
  );

describe('Password Reset Form Component', () => {
  let resetPassword = null;
  let resetStatus = null;
  let error = null;

  beforeEach(() => {
    resetPassword = jest.fn();
    resetStatus = status.NONE;
    error = [];
  });

  it('should render a form', () => {
    const { getByText, getByPlaceholderText, getByRole } = renderComponent(
      resetPassword,
      resetStatus,
      error,
    );

    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    const resetButton = getByRole('button', { name: RESET_BUTTON_TEXT });
    expect(resetButton).toBeInTheDocument();
    expect(resetButton).toHaveAttribute('disabled');
    expect(getByText('Do you have an account?')).toBeInTheDocument();
    expect(getByText('Login')).toBeInTheDocument();
  });

  it('should disable `Reset Password` button when Email too short', async () => {
    const { getByPlaceholderText, getByRole } = renderComponent(
      resetPassword,
      resetStatus,
      error,
    );

    const resetButton = getByRole('button', { name: RESET_BUTTON_TEXT });
    expect(resetButton).toHaveAttribute('disabled');
    userEvent.type(getByPlaceholderText('Email'), 't');

    userEvent.tab();

    await waitFor(() => {
      expect(resetButton).toHaveAttribute('disabled');
    });
  });

  it('should disable `Reset Password` button when Email invalid', async () => {
    const { getByPlaceholderText, getByRole } = renderComponent(
      resetPassword,
      resetStatus,
      error,
    );

    const resetButton = getByRole('button', { name: RESET_BUTTON_TEXT });
    expect(resetButton).toHaveAttribute('disabled');
    userEvent.type(getByPlaceholderText('Email'), 'testtest.com');

    userEvent.tab();

    await waitFor(() => {
      expect(resetButton).toHaveAttribute('disabled');
    });
  });

  it('should enable `Reset Password` button when form is valid', () => {
    const { getByPlaceholderText, getByRole } = renderComponent(
      resetPassword,
      resetStatus,
      error,
    );

    const resetButton = getByRole('button', { name: RESET_BUTTON_TEXT });
    expect(resetButton).toHaveAttribute('disabled');
    userEvent.type(getByPlaceholderText('Email'), 'test@test.com');

    expect(resetButton).not.toHaveAttribute('disabled');
  });

  it.each(['', 't', 'testtest.com', 'test@test.'])(
    'should not call resetPassword function when email is %s and `Reset Password` button clicked',
    email => {
      const { getByRole, getByPlaceholderText } = renderComponent(
        resetPassword,
        resetStatus,
        error,
      );

      userEvent.type(getByPlaceholderText('Email'), email);

      userEvent.tab();

      userEvent.click(getByRole('button', { name: RESET_BUTTON_TEXT }));

      expect(resetPassword).not.toHaveBeenCalled();
    },
  );

  it('should call resetPassword function when form is valid and `Reset Password` button clicked', async () => {
    const { getByRole, getByPlaceholderText } = renderComponent(
      resetPassword,
      resetStatus,
      error,
    );

    const EMAIL_TEXT = 'test@test.com';
    userEvent.type(getByPlaceholderText('Email'), EMAIL_TEXT);

    expect(resetPassword).not.toHaveBeenCalled();

    userEvent.tab();

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
