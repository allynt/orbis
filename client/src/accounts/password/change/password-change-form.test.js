import React from 'react';

import { status } from 'accounts/accounts.slice';
import { render, screen, waitFor, userEvent } from 'test/test-utils';
import { FIELD_NAMES } from 'utils/validators';

import PasswordChangeForm from './password-change-form.component';

const OLD_PASSWORD_PLACEHOLDER_TEXT = 'Old Password';
const PASSWORD_PLACEHOLDER_TEXT = 'New Password';
const PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT = 'New Password Confirmation';
const OLD_PASSWORD_TEXT = 'oldpassword';
const NEW_PASSWORD_TEXT = 'newpassword';
const CHANGE_PASSWORD_BUTTON_LABEL = 'Change Password';
const I_AGREE_TEXT = 'I agree with Terms & Conditions';

describe('Password Change Form Component', () => {
  it('should render a form', () => {
    render(<PasswordChangeForm />);

    expect(
      screen.getByLabelText(OLD_PASSWORD_PLACEHOLDER_TEXT),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(PASSWORD_PLACEHOLDER_TEXT),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
    ).toBeInTheDocument();
    //Check Terms and Conditions checkbox
    expect(
      screen.getByRole('checkbox', { name: I_AGREE_TEXT }),
    ).toBeInTheDocument();
    // Check form submit button
    const changePasswordButton = screen.getByRole('button', {
      name: CHANGE_PASSWORD_BUTTON_LABEL,
    });
    expect(changePasswordButton).toBeInTheDocument();
    // Check link to login view
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(changePasswordButton).toHaveAttribute('disabled');
  });

  it('should disable `Change Password` button when form is invalid', async () => {
    render(
      <PasswordChangeForm
        passwordMinLength={0}
        passwordMaxLength={Infinity}
        passwordStrength={0}
      />,
    );

    userEvent.type(
      screen.getByLabelText(OLD_PASSWORD_PLACEHOLDER_TEXT),
      OLD_PASSWORD_TEXT,
    );
    userEvent.type(
      screen.getByLabelText(PASSWORD_PLACEHOLDER_TEXT),
      NEW_PASSWORD_TEXT,
    );
    userEvent.type(
      screen.getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      'non-matching',
    );

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: CHANGE_PASSWORD_BUTTON_LABEL }),
      ).toBeDisabled(),
    );
  });

  it('should enable `Change Password` button when form is valid', async () => {
    render(
      <PasswordChangeForm
        passwordMinLength={0}
        passwordMaxLength={Infinity}
        passwordStrength={0}
      />,
    );

    userEvent.type(
      screen.getByLabelText(OLD_PASSWORD_PLACEHOLDER_TEXT),
      OLD_PASSWORD_TEXT,
    );

    userEvent.type(
      screen.getByLabelText(PASSWORD_PLACEHOLDER_TEXT),
      NEW_PASSWORD_TEXT,
    );

    userEvent.type(
      screen.getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      NEW_PASSWORD_TEXT,
    );

    expect(
      screen.getByRole('button', { name: CHANGE_PASSWORD_BUTTON_LABEL }),
    ).toBeDisabled();
    waitFor(() =>
      userEvent.click(screen.getByRole('checkbox', { name: I_AGREE_TEXT })),
    );

    expect(
      screen.getByRole('button', { name: CHANGE_PASSWORD_BUTTON_LABEL }),
    ).not.toBeDisabled();
  });

  it('should call `changePassword` function when form is valid and `Change Password` button clicked', async () => {
    const changePassword = jest.fn();
    render(
      <PasswordChangeForm
        passwordMinLength={0}
        passwordMaxLength={Infinity}
        passwordStrength={0}
        changePassword={changePassword}
      />,
    );

    userEvent.type(
      screen.getByLabelText(OLD_PASSWORD_PLACEHOLDER_TEXT),
      OLD_PASSWORD_TEXT,
    );
    userEvent.type(
      screen.getByLabelText(PASSWORD_PLACEHOLDER_TEXT),
      NEW_PASSWORD_TEXT,
    );
    userEvent.type(
      screen.getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      NEW_PASSWORD_TEXT,
    );

    userEvent.click(screen.getByRole('checkbox', { name: I_AGREE_TEXT }));
    userEvent.click(
      screen.getByRole('button', {
        name: CHANGE_PASSWORD_BUTTON_LABEL,
      }),
    );

    await waitFor(() =>
      expect(changePassword).toHaveBeenCalledWith({
        [FIELD_NAMES.oldPassword]: OLD_PASSWORD_TEXT,
        [FIELD_NAMES.newPassword]: NEW_PASSWORD_TEXT,
        [FIELD_NAMES.newPasswordConfirm]: NEW_PASSWORD_TEXT,
        accepted_terms: true,
      }),
    );
  });

  it('should display error well if password reset is unsuccessful', () => {
    const error = ['Test Error 1', 'Test Error 2', 'Test Error 3'];

    render(<PasswordChangeForm error={error} />);

    expect(screen.getByTestId('error-well')).toBeInTheDocument();
  });

  describe('Password Change Success View', () => {
    it('should show the Password Change success view', () => {
      render(<PasswordChangeForm changeStatus={status.PENDING} />);

      expect(
        screen.getByText('Thank you! Your password has been changed.'),
      ).toBeInTheDocument();

      expect(screen.getByText('Continue')).toBeInTheDocument();
    });
  });
});
