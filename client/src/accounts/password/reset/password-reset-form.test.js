import React from 'react';

import { status } from 'accounts/accounts.slice';
import { render, screen, waitFor, userEvent } from 'test/test-utils';
import { FIELD_NAMES } from 'utils/validators';

import PasswordResetForm from './password-reset-form.component';

const PASSWORD_PLACEHOLDER_TEXT = 'New Password';
const PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT = 'New Password Confirmation';
const RESET_BUTTON_TEXT = 'Reset Password';
const PASSWORD_TEXT = 'newpassword';

describe('Password Reset Form Component', () => {
  it('should render a form', () => {
    render(<PasswordResetForm />);

    expect(
      screen.getByLabelText(PASSWORD_PLACEHOLDER_TEXT),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
    ).toBeInTheDocument();
    // Check form submit button
    expect(screen.getByText(RESET_BUTTON_TEXT)).toBeInTheDocument();
    // Check link to login view
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('should disable `Reset Password` button when form is invalid', async () => {
    render(<PasswordResetForm />);

    userEvent.click(screen.getByRole('button', { name: RESET_BUTTON_TEXT }));

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: RESET_BUTTON_TEXT }),
      ).toBeDisabled(),
    );
  });

  it('should enable `Reset Password` button when form is valid', async () => {
    render(
      <PasswordResetForm
        passwordMinLength={2}
        passwordMaxLength={30}
        passwordStrength={0}
      />,
    );

    userEvent.type(
      screen.getByLabelText(PASSWORD_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );
    userEvent.type(
      screen.getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: RESET_BUTTON_TEXT }),
      ).not.toBeDisabled(),
    );
  });

  it('should not call `confirmResetPassword` function when form is invalid and `Reset Password` button clicked', () => {
    const confirmResetPassword = jest.fn();
    render(<PasswordResetForm confirmResetPassword={confirmResetPassword} />);

    userEvent.type(screen.getByLabelText(PASSWORD_PLACEHOLDER_TEXT), 'te');

    userEvent.tab();

    userEvent.click(screen.getByText(RESET_BUTTON_TEXT));
    expect(confirmResetPassword).not.toHaveBeenCalled();
  });

  it('should call `confirmResetPassword` function when form is valid and `Reset Password` button clicked', async () => {
    const confirmResetPassword = jest.fn();
    render(
      <PasswordResetForm
        confirmResetPassword={confirmResetPassword}
        passwordMinLength={2}
        passwordMaxLength={30}
        passwordStrength={0}
        match={{
          params: {
            uid: 'Test UID',
            token: 'Test Token',
          },
        }}
      />,
    );

    userEvent.type(
      screen.getByLabelText(PASSWORD_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );
    userEvent.type(
      screen.getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );

    userEvent.click(screen.getByRole('button', { name: RESET_BUTTON_TEXT }));

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
    render(
      <PasswordResetForm
        error={['Test Error 1', 'Test Error 2', 'Test Error 3']}
      />,
    );

    expect(screen.getByTestId('error-well')).toBeInTheDocument();
  });

  describe('Password Reset Success View', () => {
    it('should show the Password Reset success view', () => {
      render(<PasswordResetForm resetStatus={status.COMPLETE} />);

      expect(
        screen.getByText(
          'Your password has successfully been reset. Click the button to continue.',
        ),
      ).toBeInTheDocument();

      expect(screen.getByText('Continue')).toBeInTheDocument();
    });
  });
});
