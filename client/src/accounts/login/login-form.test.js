import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import LoginForm from './login-form.component';

const EMAIL_PLACEHOLDER_TEXT = /email/i;
const PASSWORD_PLACEHOLDER_TEXT = /password/i;
const LOGIN_BUTTON_TEXT = 'Login';
const EMAIL_TEXT = 'test@test.com';
const PASSWORD_TEXT = 'testpassword';
const SIGN_UP = /sign\sup/i;
const KEEP_LOGGED_IN = /keep\sme\slogged\sin/i;
const WORK_EMAIL = /work\semail\saddress/i;
const I_AGREE_TEXT = 'I agree with';

/**
 * @param {Partial<Pick<import('./login-form.component').LoginProps,
 *   'isLoading'
 *   | 'activateAccount'
 *   | 'match'
 *   | 'serverErrors'
 *   | 'user'
 *   | 'minimalUser'>>} [props]
 */
const renderComponent = props => {
  const activateAccount = jest.fn();
  const login = jest.fn();
  const minimalUser = props?.minimalUser ? props.minimalUser : { accepted_terms: false }

  const utils = render(
    // @ts-ignore
    <LoginForm
      passwordMinLength={2}
      passwordMaxLength={255}
      activateAccount={activateAccount}
      login={login}
      minimalUser={minimalUser}
      {...props}
    />,
    {
      wrapper: ({ children }) => (
        <Router history={createMemoryHistory({ initialEntries: ['/'] })}>
          {children}
        </Router>
      ),
    },
  );
  return { ...utils, activateAccount, login };
};

describe('Login Form Component', () => {
  it('should render a form', () => {
    const { getByText, getByRole, getByLabelText } = renderComponent();

    expect(
      getByRole('textbox', { name: EMAIL_PLACEHOLDER_TEXT }),
    ).toBeInTheDocument();
    expect(getByLabelText(PASSWORD_PLACEHOLDER_TEXT)).toBeInTheDocument();
    expect(getByText(I_AGREE_TEXT)).toBeInTheDocument();
    expect(
      getByRole('button', { name: LOGIN_BUTTON_TEXT }),
    ).toBeInTheDocument();
  });

  it('should disable `Login` button when form is invalid', () => {
    const { getByRole } = renderComponent();

    expect(getByRole('button', { name: LOGIN_BUTTON_TEXT })).toBeDisabled();
  });

  it('should enable `Login` button when form is valid', async () => {
    const { getByText, getByRole, getByLabelText } = renderComponent();

    const loginButton = getByRole('button', { name: LOGIN_BUTTON_TEXT });

    expect(loginButton).toBeDisabled();

    userEvent.type(
      getByRole('textbox', { name: EMAIL_PLACEHOLDER_TEXT }),
      EMAIL_TEXT,
    );

    userEvent.type(getByLabelText(PASSWORD_PLACEHOLDER_TEXT), PASSWORD_TEXT);

    userEvent.click(getByText(I_AGREE_TEXT));

    await waitFor(() => expect(loginButton).not.toHaveAttribute('disabled'));
  });

  it('should not call `login` function when form is invalid and `Login` button clicked', async () => {
    const { getByRole, login } = renderComponent();

    const loginButton = getByRole('button', { name: LOGIN_BUTTON_TEXT });

    userEvent.type(
      getByRole('textbox', { name: EMAIL_PLACEHOLDER_TEXT }),
      EMAIL_TEXT,
    );

    userEvent.tab();

    userEvent.click(loginButton);

    expect(login).not.toHaveBeenCalled();
  });

  it('should call `login` function when form is valid and `Login` button clicked', async () => {
    const { getByText, getByRole, getByLabelText, login } = renderComponent();

    userEvent.type(
      getByRole('textbox', { name: EMAIL_PLACEHOLDER_TEXT }),
      EMAIL_TEXT,
    );
    userEvent.type(getByLabelText(PASSWORD_PLACEHOLDER_TEXT), PASSWORD_TEXT);

    userEvent.click(getByText(I_AGREE_TEXT));

    userEvent.click(getByRole('button', { name: LOGIN_BUTTON_TEXT }));

    await waitFor(() =>
      expect(login).toHaveBeenCalledWith({
        email: EMAIL_TEXT,
        password: PASSWORD_TEXT,
        termsAgreed: true,
      }),
    );
  });

  it('should display error well if login is unsuccessful', () => {
    const serverErrors = ['Test Error 1', 'Test Error 2', 'Test Error 3'];

    const { getByTestId } = renderComponent({ serverErrors });

    expect(getByTestId('error-well')).toBeInTheDocument();
  });

  it('calls activateAccount if the supplied user is not verified and the url has a key', () => {
    const { activateAccount } = renderComponent({
      // @ts-ignore
      user: { is_verified: false },
      // @ts-ignore
      match: { params: { key: '123' } },
    });
    expect(activateAccount).toBeCalledWith({ key: '123' });
  });

  it('shows a loading spinner if loading', () => {
    const { getByRole } = renderComponent({ isLoading: true });
    expect(getByRole('alert')).toBeInTheDocument();
  });

  it('only shows `Terms and Conditions` checkbox if user has not agreed already', () => {
    const { getByRole } = renderComponent();
    
    expect(getByRole('checkbox')).toBeInTheDocument();
  })

  it('does not show `Terms and Conditions` checkbox if user has agreed already', () => {
    const { queryByRole } = renderComponent({ minimalUser: { accepted_terms: true } });

    expect(queryByRole('checkbox')).not.toBeInTheDocument();
  })

  describe('Customer Registration Flow', () => {
    /** @type {Partial<User>} */
    const user = { registration_stage: 'CUSTOMER' };

    it('does not show the sign up link', () => {
      const { queryByRole } = renderComponent({ user });
      expect(queryByRole('link', { name: SIGN_UP })).not.toBeInTheDocument();
    });

    it('does not show keep me logged in', () => {
      const { queryByRole } = renderComponent({ user });
      expect(
        queryByRole('checkbox', { name: KEEP_LOGGED_IN }),
      ).not.toBeInTheDocument();
    });

    it('has the work email address label', () => {
      const { getByRole } = renderComponent({ user });
      expect(getByRole('textbox', { name: WORK_EMAIL })).toBeInTheDocument();
    });
  });
});
