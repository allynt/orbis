// @ts-nocheck
import React from 'react';

import { render, waitFor, screen, userEvent } from 'test/test-utils';

import LoginForm from './login-form.component';

const EMAIL_PLACEHOLDER_TEXT = /email/i;
const PASSWORD_PLACEHOLDER_TEXT = /password \*/i;
const LOGIN_BUTTON_TEXT = 'Login';
const EMAIL_TEXT = 'test@test.com';
const PASSWORD_TEXT = 'testpassword';
const SIGN_UP = /sign up/i;
const KEEP_LOGGED_IN = /keep\sme\slogged\sin/i;
const WORK_EMAIL = /work\semail\saddress/i;
const I_AGREE_TEXT =
  'I agree with the Terms & Conditions and the Privacy Policy';

/** @type {jest.Mock} */
let login;

beforeEach(() => (login = jest.fn()));

describe('Login Form Component', () => {
  it('should render a form', () => {
    render(<LoginForm />);

    expect(
      screen.getByRole('textbox', { name: EMAIL_PLACEHOLDER_TEXT }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(PASSWORD_PLACEHOLDER_TEXT),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: LOGIN_BUTTON_TEXT }),
    ).toBeInTheDocument();
  });

  it('should disable `Login` button when form is invalid', () => {
    render(<LoginForm />);

    expect(
      screen.getByRole('button', { name: LOGIN_BUTTON_TEXT }),
    ).toBeDisabled();
  });

  it('should enable `Login` button when form is valid', async () => {
    render(<LoginForm />);

    expect(
      screen.getByRole('button', { name: LOGIN_BUTTON_TEXT }),
    ).toBeDisabled();

    userEvent.type(
      screen.getByRole('textbox', { name: EMAIL_PLACEHOLDER_TEXT }),
      EMAIL_TEXT,
    );

    await userEvent.type(
      screen.getByLabelText(PASSWORD_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );

    expect(
      screen.getByRole('button', { name: LOGIN_BUTTON_TEXT }),
    ).not.toBeDisabled();
  });

  it('should not call `login` function when form is invalid and `Login` button clicked', async () => {
    render(<LoginForm login={login} />);

    const loginButton = screen.getByRole('button', { name: LOGIN_BUTTON_TEXT });

    userEvent.type(
      screen.getByRole('textbox', { name: EMAIL_PLACEHOLDER_TEXT }),
      EMAIL_TEXT,
    );

    userEvent.tab();

    userEvent.click(loginButton);

    expect(login).not.toHaveBeenCalled();
  });

  it('should call `login` function when form is valid and `Login` button clicked', async () => {
    render(
      <LoginForm login={login} passwordMinLength={2} passwordMaxLength={255} />,
    );

    userEvent.type(
      screen.getByRole('textbox', { name: EMAIL_PLACEHOLDER_TEXT }),
      EMAIL_TEXT,
    );
    userEvent.type(
      screen.getByLabelText(PASSWORD_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );

    userEvent.click(screen.getByRole('button', { name: LOGIN_BUTTON_TEXT }));

    await waitFor(() =>
      expect(login).toHaveBeenCalledWith({
        email: EMAIL_TEXT,
        password: PASSWORD_TEXT,
      }),
    );
  });

  it('calls login with accepted terms if not accepted', async () => {
    render(
      <LoginForm
        login={login}
        passwordMinLength={2}
        passwordMaxLength={255}
        user={{ accepted_terms: false }}
      />,
    );

    userEvent.type(
      screen.getByRole('textbox', { name: EMAIL_PLACEHOLDER_TEXT }),
      EMAIL_TEXT,
    );
    userEvent.type(
      screen.getByLabelText(PASSWORD_PLACEHOLDER_TEXT),
      PASSWORD_TEXT,
    );
    userEvent.click(screen.getByRole('checkbox'));
    userEvent.click(screen.getByRole('button', { name: LOGIN_BUTTON_TEXT }));
    await waitFor(() =>
      expect(login).toHaveBeenCalledWith(
        expect.objectContaining({ accepted_terms: true }),
      ),
    );
  });

  it('should display error well if login is unsuccessful', () => {
    const serverErrors = ['Test Error 1', 'Test Error 2', 'Test Error 3'];

    render(<LoginForm serverErrors={serverErrors} />);

    expect(screen.getByTestId('error-well')).toBeInTheDocument();
  });

  describe('activateAccount', () => {
    /** @type {jest.Mock} */
    let activateAccount;
    const match = { params: { key: '123' } };

    beforeEach(() => (activateAccount = jest.fn()));

    it('calls activateAccount if the supplied user is not verified and the url has a key', () => {
      render(
        <LoginForm
          user={{ is_verified: false }}
          match={match}
          activateAccount={activateAccount}
        />,
      );
      expect(activateAccount).toBeCalledWith({ key: '123' });
    });

    it('calls activateAccount if is_verified is a false string and the url has a key', () => {
      render(
        <LoginForm
          user={{ is_verified: 'False' }}
          match={match}
          activateAccount={activateAccount}
        />,
      );
      expect(activateAccount).toBeCalledWith({ key: '123' });
    });

    it('calls activate account if user is undefined and the url has a key', () => {
      render(<LoginForm match={match} activateAccount={activateAccount} />);
      expect(activateAccount).toBeCalled();
    });
  });

  it('shows a loading spinner if loading', () => {
    render(<LoginForm isLoading />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('only shows `Terms and Conditions` checkbox if user has not agreed already', () => {
    render(<LoginForm user={{ accepted_terms: false }} />);

    expect(
      screen.getByRole('checkbox', { name: I_AGREE_TEXT }),
    ).toBeInTheDocument();
  });

  it('does not show `Terms and Conditions` checkbox if user has agreed already', () => {
    render(<LoginForm user={{ accepted_terms: true }} />);

    expect(
      screen.queryByRole('checkbox', { name: I_AGREE_TEXT }),
    ).not.toBeInTheDocument();
  });

  describe('Customer Registration Flow', () => {
    /** @type {Partial<import('typings').User>} */
    const user = { registration_stage: 'CUSTOMER' };

    beforeEach(() => {
      render(<LoginForm user={user} />);
    });

    it('does not show the sign up link', () => {
      expect(
        screen.queryByRole('link', { name: SIGN_UP }),
      ).not.toBeInTheDocument();
    });

    it('does not show keep me logged in', () => {
      expect(
        screen.queryByRole('checkbox', { name: KEEP_LOGGED_IN }),
      ).not.toBeInTheDocument();
    });

    it('has the work email address label', () => {
      expect(
        screen.getByRole('textbox', { name: WORK_EMAIL }),
      ).toBeInTheDocument();
    });
  });
});
