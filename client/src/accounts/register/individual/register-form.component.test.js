import React from 'react';

import fetchMock from 'jest-fetch-mock';

import { render, screen, waitFor, userEvent } from 'test/test-utils';
import { FIELD_NAMES } from 'utils/validators';

import RegisterForm from './register-form.component';

const EMAIL_PLACEHOLDER_TEXT = 'Email';
const PASSWORD_PLACEHOLDER_TEXT = 'Password';
const PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT = 'Password Confirmation';
const SIGN_UP_BUTTON_TEXT = 'Sign Up';
const PASSWORD_TEXT = 'newpassword';
const EMAIL_TEXT = 'test@test.com';
const I_AGREE_TEXT = /I agree with/i;
const TERMS_URL = 'www.terms.com';

const testAppConfig = {
  termsUrl: TERMS_URL,
  passwordMinLength: 8,
  passwordMaxLength: 255,
  passwordStrength: 0,
  isRegistrationOpen: true,
  isVerificationRequired: true,
  isApprovalRequired: false,
};

describe('Register Form Component', () => {
  it('should render a form', () => {
    render(<RegisterForm termsUrl={TERMS_URL} />);

    expect(
      screen.getByRole('textbox', { name: EMAIL_PLACEHOLDER_TEXT }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(PASSWORD_PLACEHOLDER_TEXT),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
    ).toBeInTheDocument();
    // Check password strength component exists
    expect(screen.getByText(I_AGREE_TEXT)).toBeInTheDocument();

    //Check the I agree with button is in the document and has the correct href
    const termsCheckbox = screen.getByText('Terms & Conditions');
    expect(termsCheckbox).toBeInTheDocument();
    expect(termsCheckbox.href).toContain(TERMS_URL);
    // Check form submit button
    const signUpButton = screen.getByRole('button', {
      name: SIGN_UP_BUTTON_TEXT,
    });
    expect(signUpButton).toBeInTheDocument();
    // Check link to login view
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(signUpButton).toBeDisabled();
  });

  it('should disable `Sign Up` button when form is invalid and show text', () => {
    render(<RegisterForm {...testAppConfig} />);

    const email = screen.getByRole('textbox', { name: EMAIL_PLACEHOLDER_TEXT });
    expect(email).toHaveValue('');
    userEvent.type(email, EMAIL_TEXT);
    expect(email).toHaveValue(EMAIL_TEXT);

    expect(
      screen.getByRole('button', { name: SIGN_UP_BUTTON_TEXT }),
    ).toBeDisabled();
  });

  it('should enable `Sign Up` button when form is valid', () => {
    render(<RegisterForm {...testAppConfig} />);

    userEvent.type(
      screen.getByRole('textbox', { name: EMAIL_PLACEHOLDER_TEXT }),
      EMAIL_TEXT,
    );
    userEvent.type(
      screen.getByLabelText(PASSWORD_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );
    userEvent.type(
      screen.getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );

    expect(
      screen.getByRole('button', { name: SIGN_UP_BUTTON_TEXT }),
    ).toBeDisabled();
    userEvent.click(screen.getByRole('checkbox', { name: I_AGREE_TEXT }));
    expect(
      screen.getByRole('button', { name: SIGN_UP_BUTTON_TEXT }),
    ).toBeEnabled();
  });

  it('should keep `Sign Up` button disabled when registration is disabled', () => {
    const state = {
      accounts: { error: 'Test Error' },
      app: { config: { ...testAppConfig, isRegistrationOpen: false } },
    };

    render(<RegisterForm />, { state });

    userEvent.type(
      screen.getByRole('textbox', { name: EMAIL_PLACEHOLDER_TEXT }),
      EMAIL_TEXT,
    );
    userEvent.type(
      screen.getByLabelText(PASSWORD_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );
    userEvent.type(
      screen.getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );

    expect(
      screen.getByRole('button', { name: SIGN_UP_BUTTON_TEXT }),
    ).toBeDisabled();
  });

  it('should not call register function when form is invalid and `Sign Up` button clicked', () => {
    fetchMock.enableMocks();
    const registerUser = jest.fn();
    fetchMock.mockResponse(JSON.stringify({}, { status: 200 }));

    render(<RegisterForm {...testAppConfig} registerUser={registerUser} />);

    waitFor(() => userEvent.click(screen.getByText(SIGN_UP_BUTTON_TEXT)));
    expect(registerUser).not.toHaveBeenCalled();
  });

  it('should call register function when form is valid and `Sign Up` button clicked', async () => {
    const registerUser = jest.fn();
    render(<RegisterForm {...testAppConfig} registerUser={registerUser} />);

    userEvent.type(
      screen.getByRole('textbox', { name: EMAIL_PLACEHOLDER_TEXT }),
      EMAIL_TEXT,
    );
    userEvent.type(
      screen.getByLabelText(PASSWORD_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );
    userEvent.type(
      screen.getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );

    userEvent.click(screen.getByRole('checkbox', { name: I_AGREE_TEXT }));

    expect(registerUser).not.toHaveBeenCalled();
    userEvent.click(screen.getByRole('button', { name: SIGN_UP_BUTTON_TEXT }));
    expect(registerUser).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(registerUser).toHaveBeenCalledWith({
        [FIELD_NAMES.email]: EMAIL_TEXT,
        [FIELD_NAMES.newPassword]: PASSWORD_TEXT,
        [FIELD_NAMES.newPasswordConfirm]: PASSWORD_TEXT,
        accepted_terms: true,
      }),
    );
  });

  it('should display error well if password reset is unsuccessful', () => {
    const error = ['Test Error 1', 'Test Error 2', 'Test Error 3'];
    render(<RegisterForm serverErrors={error} />);

    expect(screen.getByTestId('error-well')).toBeInTheDocument();
  });

  it('shows a loading spinner when loading', () => {
    render(<RegisterForm isLoading={true} />);

    expect(screen.getAllByRole('progressbar').length).toBe(2);
  });
});
