import React from 'react';

import { render, waitFor } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import RegisterForm from './register-form.component';
import { status } from '../accounts.slice';

const mockStore = configureMockStore([thunk]);

const EMAIL_PLACEHOLDER_TEXT = 'Email';
const PASSWORD_PLACEHOLDER_TEXT = 'Password';
const PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT = 'Password Confirmation';
const SIGN_UP_BUTTON_TEXT = 'Sign Up';
const PASSWORD_TEXT = 'newpassword';
const EMAIL_TEXT = 'test@test.com';
const I_AGREE_TEXT = 'I agree with';

const testAppConfig = {
  passwordMinLength: 8,
  passwordMaxLength: 255,
  passwordStrength: 2,
  isRegistrationOpen: true,
  isVerificationRequired: true,
  isApprovalRequired: false,
};

const renderComponent = (
  history,
  store,
  registerUser,
  registerUserStatus,
  resendVerificationEmail,
  error,
) =>
  render(
    <RegisterForm
      registerUser={registerUser}
      registerUserStatus={registerUserStatus}
      resendVerificationEmail={resendVerificationEmail}
      error={error}
    />,
    {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Provider store={store}>{children}</Provider>
        </Router>
      ),
    },
  );

describe('Register Form Component', () => {
  let history = null;
  let store;
  let registerUser = null;
  let registerUserStatus = null;
  let resendVerificationEmail = null;
  let error = null;

  beforeEach(() => {
    history = createMemoryHistory({ initialEntries: ['/accounts/register'] });
    store = mockStore({
      app: { config: testAppConfig },
    });
    registerUser = jest.fn();
    registerUserStatus = status.NONE;
    resendVerificationEmail = jest.fn();
    error = ['Test Error 1', 'Test Error 2', 'Test Error 3'];
  });

  it('should render a form', () => {
    const { getByRole, getByText, getByPlaceholderText } = renderComponent(
      history,
      store,
      registerUser,
      registerUserStatus,
      resendVerificationEmail,
      error,
    );

    expect(getByPlaceholderText(EMAIL_PLACEHOLDER_TEXT)).toBeInTheDocument();
    expect(getByPlaceholderText(PASSWORD_PLACEHOLDER_TEXT)).toBeInTheDocument();
    expect(
      getByPlaceholderText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
    ).toBeInTheDocument();
    // Check password strength component exists
    expect(getByText(I_AGREE_TEXT)).toBeInTheDocument();

    //Check the I agree with button is in the document and has the correct href
    const termsCheckbox = getByText('Terms & Conditions');
    expect(termsCheckbox).toBeInTheDocument();
    expect(termsCheckbox.href).toContain('/terms');
    // Check form submit button
    const signUpButton = getByRole('button', { name: SIGN_UP_BUTTON_TEXT });
    expect(signUpButton).toBeInTheDocument();
    // Check link to login view
    expect(getByText('Login')).toBeInTheDocument();
    expect(signUpButton).toHaveAttribute('disabled');
  });

  it('should disable `Sign Up` button when form is invalid', () => {
    const { getByText, getByPlaceholderText } = renderComponent(
      history,
      store,
      registerUser,
      registerUserStatus,
      resendVerificationEmail,
      error,
    );

    const email = getByPlaceholderText(EMAIL_PLACEHOLDER_TEXT);
    expect(email.value).toEqual('');
    userEvent.type(email, EMAIL_TEXT);
    expect(email.value).toEqual(EMAIL_TEXT);

    expect(getByText(SIGN_UP_BUTTON_TEXT)).toHaveAttribute('disabled');
  });

  it('should enable `Sign Up` button when form is valid', () => {
    const { getByText, getByPlaceholderText } = renderComponent(
      history,
      store,
      registerUser,
      registerUserStatus,
      resendVerificationEmail,
      error,
    );

    userEvent.type(getByPlaceholderText(EMAIL_PLACEHOLDER_TEXT), EMAIL_TEXT);
    userEvent.type(
      getByPlaceholderText(PASSWORD_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );
    userEvent.type(
      getByPlaceholderText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );

    waitFor(() => getByText(I_AGREE_TEXT));
    expect(getByText(SIGN_UP_BUTTON_TEXT)).toHaveAttribute('disabled');
    userEvent.click(getByText(I_AGREE_TEXT));
    expect(getByText(SIGN_UP_BUTTON_TEXT)).not.toHaveAttribute('disabled');
  });

  it('should keep `Sign Up` button disabled when registration is disabled', () => {
    store = mockStore({
      accounts: { error: 'Test Error' },
      app: { config: { ...testAppConfig, isRegistrationOpen: false } },
    });

    const { getByText, getByPlaceholderText } = renderComponent(
      history,
      store,
      registerUser,
      registerUserStatus,
      resendVerificationEmail,
      error,
    );

    userEvent.type(getByPlaceholderText(EMAIL_PLACEHOLDER_TEXT), EMAIL_TEXT);
    userEvent.type(
      getByPlaceholderText(PASSWORD_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );
    userEvent.type(
      getByPlaceholderText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );

    expect(getByText(SIGN_UP_BUTTON_TEXT)).toHaveAttribute('disabled');
  });

  it('should not call register function when form is invalid and `Sign Up` button clicked', () => {
    fetch.mockResponse(JSON.stringify({}, { status: 200 }));

    const { getByText } = renderComponent(
      history,
      store,
      registerUser,
      registerUserStatus,
      resendVerificationEmail,
      error,
    );

    waitFor(() => userEvent.click(getByText(SIGN_UP_BUTTON_TEXT)));
    expect(registerUser).not.toHaveBeenCalled();
  });

  it('should call register function when form is valid and `Sign Up` button clicked', async () => {
    const { getByRole, getByText, getByPlaceholderText } = renderComponent(
      history,
      store,
      registerUser,
      registerUserStatus,
      resendVerificationEmail,
      error,
    );

    userEvent.type(getByPlaceholderText(EMAIL_PLACEHOLDER_TEXT), EMAIL_TEXT);
    userEvent.type(
      getByPlaceholderText(PASSWORD_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );
    userEvent.type(
      getByPlaceholderText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );

    userEvent.click(getByText(I_AGREE_TEXT));

    expect(registerUser).not.toHaveBeenCalled();
    userEvent.click(getByRole('button', { name: SIGN_UP_BUTTON_TEXT }));
    expect(registerUser).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(registerUser).toHaveBeenCalledWith({
        email: EMAIL_TEXT,
        password1: PASSWORD_TEXT,
        password2: PASSWORD_TEXT,
        accepted_terms: true,
      }),
    );
  });

  it('should display error well if password reset is unsuccessful', () => {
    error = ['Test Error 1', 'Test Error 2', 'Test Error 3'];

    const { getByTestId } = renderComponent(
      history,
      store,
      registerUser,
      status.NONE,
      resendVerificationEmail,
      error,
    );

    expect(getByTestId('error-well')).toBeInTheDocument();
  });

  describe('Register Success View', () => {
    it('should show the Register success view', () => {
      const { getByText } = renderComponent(
        history,
        store,
        registerUser,
        status.PENDING,
        resendVerificationEmail,
        error,
      );

      expect(getByText('Check your email')).toBeInTheDocument();

      expect(getByText('Continue')).toBeInTheDocument();
    });
  });
});
