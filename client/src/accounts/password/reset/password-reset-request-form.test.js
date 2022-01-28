import React from 'react';

import { render, screen, waitFor, userEvent } from 'test/test-utils';

import { status } from '../../accounts.slice';
import PasswordResetRequestForm from './password-reset-request-form.component';

const RESET_BUTTON_TEXT = 'Reset Password';

describe('Password Reset Request Form Component', () => {
  it('should render a form', () => {
    render(<PasswordResetRequestForm />);

    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
    const resetButton = screen.getByRole('button', { name: RESET_BUTTON_TEXT });

    expect(resetButton).toBeInTheDocument();
    expect(resetButton).toBeDisabled();
    expect(screen.getByText('Do you have an account?')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('should disable `Reset Password` button when Email field is empty', async () => {
    render(<PasswordResetRequestForm />);

    const resetButton = screen.getByRole('button', { name: RESET_BUTTON_TEXT });
    expect(resetButton).toBeDisabled();

    await waitFor(() => {
      expect(resetButton).toHaveAttribute('disabled');
    });
  });

  it('should disable `Reset Password` button when Email too short', async () => {
    render(<PasswordResetRequestForm />);

    const resetButton = screen.getByRole('button', { name: RESET_BUTTON_TEXT });
    expect(resetButton).toBeDisabled();
    userEvent.type(screen.getByRole('textbox', { name: 'Email' }), 't');

    userEvent.tab();

    await waitFor(() => {
      expect(resetButton).toHaveAttribute('disabled');
    });
  });

  it('should disable `Reset Password` button when Email invalid', async () => {
    render(<PasswordResetRequestForm />);

    const resetButton = screen.getByRole('button', { name: RESET_BUTTON_TEXT });
    expect(resetButton).toBeDisabled();
    userEvent.type(
      screen.getByRole('textbox', { name: 'Email' }),
      'testtest.com',
    );

    userEvent.tab();

    await waitFor(() => {
      expect(resetButton).toHaveAttribute('disabled');
    });
  });

  it('should enable `Reset Password` button when form is valid', async () => {
    render(<PasswordResetRequestForm />);

    expect(
      screen.getByRole('button', { name: RESET_BUTTON_TEXT }),
    ).toBeDisabled();
    userEvent.type(
      screen.getByRole('textbox', { name: 'Email' }),
      'test@test.com',
    );

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: RESET_BUTTON_TEXT }),
      ).toBeEnabled(),
    );
  });

  it.each(['t', 'testtest.com', 'test@test.'])(
    'should not call resetPassword function when email is %s and `Reset Password` button clicked',
    async email => {
      const resetPassword = jest.fn();
      render(<PasswordResetRequestForm resetPassword={resetPassword} />);

      userEvent.type(screen.getByRole('textbox', { name: 'Email' }), email);
      await waitFor(() =>
        userEvent.click(
          screen.getByRole('button', { name: RESET_BUTTON_TEXT }),
        ),
      );

      expect(resetPassword).not.toHaveBeenCalled();
    },
  );

  it('should call resetPassword function when form is valid and `Reset Password` button clicked', async () => {
    const resetPassword = jest.fn();
    render(<PasswordResetRequestForm resetPassword={resetPassword} />);

    const EMAIL_TEXT = 'test@test.com';
    userEvent.type(screen.getByRole('textbox', { name: 'Email' }), EMAIL_TEXT);

    userEvent.click(screen.getByRole('button', { name: RESET_BUTTON_TEXT }));

    await waitFor(() =>
      expect(resetPassword).toHaveBeenCalledWith({ email: EMAIL_TEXT }),
    );
  });

  it('should display error well if password reset is unsuccessful', () => {
    render(
      <PasswordResetRequestForm
        error={['Test Error 1', 'Test Error 2', 'Test Error 3']}
      />,
    );

    expect(screen.getByTestId('error-well')).toBeInTheDocument();
  });

  describe('Password Reset Success View', () => {
    it('should show the Password Change success view', () => {
      render(<PasswordResetRequestForm resetStatus={status.PENDING} />);

      expect(screen.getByText('Check your email')).toBeInTheDocument();
      expect(screen.getByText('Return to login')).toBeInTheDocument();
    });
  });
});
