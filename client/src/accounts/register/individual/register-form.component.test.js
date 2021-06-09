import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { FIELD_NAMES } from 'utils/validators';

import RegisterForm from './register-form.component';

const mockStore = configureMockStore([thunk]);

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

const renderComponent = (
  history,
  store,
  registerUser,
  error,
  isLoading = false,
) =>
  render(
    <RegisterForm
      registerUser={registerUser}
      serverErrors={error}
      isLoading={isLoading}
      {...testAppConfig}
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
  let error = null;

  beforeEach(() => {
    history = createMemoryHistory({ initialEntries: ['/accounts/register'] });
    store = mockStore({
      app: { config: testAppConfig },
    });
    registerUser = jest.fn();
    error = ['Test Error 1', 'Test Error 2', 'Test Error 3'];
  });

  it('should render a form', () => {
    const { getByRole, getByText, getByLabelText } = renderComponent(
      history,
      store,
      registerUser,
      error,
    );

    expect(
      getByRole('textbox', { name: EMAIL_PLACEHOLDER_TEXT }),
    ).toBeInTheDocument();
    expect(getByLabelText(PASSWORD_PLACEHOLDER_TEXT)).toBeInTheDocument();
    expect(
      getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
    ).toBeInTheDocument();
    // Check password strength component exists
    expect(getByText(I_AGREE_TEXT)).toBeInTheDocument();

    //Check the I agree with button is in the document and has the correct href
    const termsCheckbox = getByText('Terms & Conditions');
    expect(termsCheckbox).toBeInTheDocument();
    expect(termsCheckbox.href).toContain(TERMS_URL);
    // Check form submit button
    const signUpButton = getByRole('button', { name: SIGN_UP_BUTTON_TEXT });
    expect(signUpButton).toBeInTheDocument();
    // Check link to login view
    expect(getByText('Login')).toBeInTheDocument();
    expect(signUpButton).toHaveAttribute('disabled');
  });

  it('should disable `Sign Up` button when form is invalid and show text', () => {
    const { getByRole } = renderComponent(history, store, registerUser, error);

    const email = getByRole('textbox', { name: EMAIL_PLACEHOLDER_TEXT });
    expect(email.value).toEqual('');
    userEvent.type(email, EMAIL_TEXT);
    expect(email.value).toEqual(EMAIL_TEXT);

    expect(getByRole('button', { name: SIGN_UP_BUTTON_TEXT })).toBeDisabled();
  });

  it('should enable `Sign Up` button when form is valid', () => {
    const { getByLabelText, getByRole } = renderComponent(
      history,
      store,
      registerUser,
      error,
    );

    userEvent.type(
      getByRole('textbox', { name: EMAIL_PLACEHOLDER_TEXT }),
      EMAIL_TEXT,
    );
    userEvent.type(getByLabelText(PASSWORD_PLACEHOLDER_TEXT), PASSWORD_TEXT);
    userEvent.type(
      getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );

    expect(getByRole('button', { name: SIGN_UP_BUTTON_TEXT })).toBeDisabled();
    userEvent.click(getByRole('checkbox', { name: I_AGREE_TEXT }));
    expect(
      getByRole('button', { name: SIGN_UP_BUTTON_TEXT }),
    ).not.toBeDisabled();
  });

  it('should keep `Sign Up` button disabled when registration is disabled', () => {
    store = mockStore({
      accounts: { error: 'Test Error' },
      app: { config: { ...testAppConfig, isRegistrationOpen: false } },
    });

    const { getByLabelText, getByRole } = renderComponent(
      history,
      store,
      registerUser,
      error,
    );

    userEvent.type(
      getByRole('textbox', { name: EMAIL_PLACEHOLDER_TEXT }),
      EMAIL_TEXT,
    );
    userEvent.type(getByLabelText(PASSWORD_PLACEHOLDER_TEXT), PASSWORD_TEXT);
    userEvent.type(
      getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );

    expect(getByRole('button', { name: SIGN_UP_BUTTON_TEXT })).toBeDisabled();
  });

  it('should not call register function when form is invalid and `Sign Up` button clicked', () => {
    fetch.mockResponse(JSON.stringify({}, { status: 200 }));

    const { getByText } = renderComponent(history, store, registerUser, error);

    waitFor(() => userEvent.click(getByText(SIGN_UP_BUTTON_TEXT)));
    expect(registerUser).not.toHaveBeenCalled();
  });

  it('should call register function when form is valid and `Sign Up` button clicked', async () => {
    const { getByRole, getByLabelText } = renderComponent(
      history,
      store,
      registerUser,
      error,
    );

    userEvent.type(
      getByRole('textbox', { name: EMAIL_PLACEHOLDER_TEXT }),
      EMAIL_TEXT,
    );
    userEvent.type(getByLabelText(PASSWORD_PLACEHOLDER_TEXT), PASSWORD_TEXT);
    userEvent.type(
      getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );

    userEvent.click(getByRole('checkbox', { name: I_AGREE_TEXT }));

    expect(registerUser).not.toHaveBeenCalled();
    userEvent.click(getByRole('button', { name: SIGN_UP_BUTTON_TEXT }));
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
    error = ['Test Error 1', 'Test Error 2', 'Test Error 3'];

    const { getByTestId } = renderComponent(
      history,
      store,
      registerUser,
      error,
    );

    expect(getByTestId('error-well')).toBeInTheDocument();
  });

  it('shows a loading spinner when loading', () => {
    const { getAllByRole } = renderComponent(
      history,
      store,
      registerUser,
      error,
      true,
    );
    expect(getAllByRole('progressbar').length).toBe(2);
  });
});
