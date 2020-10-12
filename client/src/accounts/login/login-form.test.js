import React from 'react';

import { render, waitFor } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { status } from '../accounts.slice';

import LoginForm from './login-form.component';

const mockStore = configureMockStore([thunk]);

const EMAIL_PLACEHOLDER_TEXT = 'Email';
const PASSWORD_PLACEHOLDER_TEXT = 'Password';
const LOGIN_BUTTON_TEXT = 'Login';
const EMAIL_TEXT = 'test@test.com';
const PASSWORD_TEXT = 'testpassword';

const renderComponent = (
  history,
  store,
  login,
  user,
  error,
  resendVerificationEmail,
  verificationEmailStatus,
) =>
  render(
    <LoginForm
      login={login}
      user={user}
      error={error}
      resendVerificationEmail={resendVerificationEmail}
      verificationEmailStatus={verificationEmailStatus}
      passwordMinLength={2}
      passwordMaxLength={255}
    />,
    {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Provider store={store}>{children}</Provider>
        </Router>
      ),
    },
  );

describe('Login Form Component', () => {
  let history = null;
  let store = null;
  let login = null;
  let user = null;
  let error = null;
  let resendVerificationEmail = 'resend@test.com';
  let verificationEmailStatus = status.NONE;

  beforeEach(() => {
    history = createMemoryHistory({ initialEntries: ['/'] });
    store = mockStore({
      app: { config: { passwordMinLength: 2, passwordMaxLength: 50 } },
    });
    login = jest.fn();
    user = null;
    error = ['Test Error 1', 'Test Error 2', 'Test Error 3'];
    resendVerificationEmail = null;
    verificationEmailStatus = null;
  });

  it('should render a form', () => {
    const { debug, getByRole, getByPlaceholderText } = renderComponent(
      history,
      store,
      login,
      user,
      error,
      resendVerificationEmail,
      verificationEmailStatus,
    );

    expect(getByPlaceholderText(EMAIL_PLACEHOLDER_TEXT)).toBeInTheDocument();
    expect(getByPlaceholderText(PASSWORD_PLACEHOLDER_TEXT)).toBeInTheDocument();

    const loginButton = getByRole('button', { name: LOGIN_BUTTON_TEXT });
    expect(loginButton).toHaveTextContent(LOGIN_BUTTON_TEXT);

    // debug();
    expect(loginButton).toHaveAttribute('disabled', '');
  });

  it('should disable `Login` button when form is invalid', () => {
    const { debug, getByRole, getByPlaceholderText } = renderComponent(
      history,
      store,
      login,
      user,
      error,
      resendVerificationEmail,
      verificationEmailStatus,
    );

    expect(getByRole('button', { name: LOGIN_BUTTON_TEXT })).toHaveAttribute(
      'disabled',
    );
  });

  it('should enable `Login` button when form is valid', () => {
    const { getByText, getByPlaceholderText } = renderComponent(
      history,
      store,
      login,
      user,
      error,
      resendVerificationEmail,
      verificationEmailStatus,
    );

    expect(getByText(LOGIN_BUTTON_TEXT)).toHaveAttribute('disabled');

    userEvent.type(getByPlaceholderText(EMAIL_PLACEHOLDER_TEXT), EMAIL_TEXT);

    userEvent.type(
      getByPlaceholderText(PASSWORD_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );

    waitFor(() =>
      expect(getByText(LOGIN_BUTTON_TEXT)).not.toHaveAttribute('disabled'),
    );
  });

  it('should not call `login` function when form is invalid and `Login` button clicked', () => {
    const { getByRole, getByPlaceholderText } = renderComponent(
      history,
      store,
      login,
      user,
      error,
      resendVerificationEmail,
      verificationEmailStatus,
    );

    const loginButton = getByRole('button', { name: LOGIN_BUTTON_TEXT });

    userEvent.type(getByPlaceholderText(EMAIL_PLACEHOLDER_TEXT), EMAIL_TEXT);

    waitFor(() => userEvent.tab());

    userEvent.click(loginButton);

    expect(login).not.toHaveBeenCalled();
  });

  it('should call `login` function when form is valid and `Login` button clicked', async () => {
    const { debug, getByRole, getByPlaceholderText } = renderComponent(
      history,
      store,
      login,
      user,
      error,
      resendVerificationEmail,
      verificationEmailStatus,
    );

    userEvent.type(getByPlaceholderText(EMAIL_PLACEHOLDER_TEXT), EMAIL_TEXT);
    userEvent.type(
      getByPlaceholderText(PASSWORD_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );

    userEvent.click(getByRole('button', { name: LOGIN_BUTTON_TEXT }));

    await waitFor(() =>
      expect(login).toHaveBeenCalledWith({
        email: EMAIL_TEXT,
        password: PASSWORD_TEXT,
      }),
    );
  });

  it('should display error well if login is unsuccessful', () => {
    error = ['Test Error 1', 'Test Error 2', 'Test Error 3'];

    const { getByTestId } = renderComponent(
      history,
      store,
      login,
      user,
      error,
      resendVerificationEmail,
      verificationEmailStatus,
    );

    expect(getByTestId('error-well')).toBeInTheDocument();
  });
});
