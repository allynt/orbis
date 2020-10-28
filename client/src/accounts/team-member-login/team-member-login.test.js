import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import TeamMemberLogin from './team-member-login.component';

const PASSWORD_PLACEHOLDER_TEXT = /password/i;
const LOGIN_BUTTON_TEXT = 'Accept and Log in';
const EMAIL_TEXT = 'test@test.com';
const NAME_TEXT = 'John Smith';
const PASSWORD_TEXT = 'testpassword';

/**
 * @param {Partial<Pick<import('./team-member-login.component').TeamMemberLoginProps,
 *   'isLoading'
 *   | 'activateAccount'
 *   | 'match'
 *   | 'serverErrors'
 *   | 'user'>>} [props]
 */
const renderComponent = props => {
  const activateAccount = jest.fn();
  const login = jest.fn();
  const utils = render(
    // @ts-ignore
    <TeamMemberLogin
      email={EMAIL_TEXT}
      passwordMinLength={2}
      passwordMaxLength={255}
      passwordStrength={0}
      activateAccount={activateAccount}
      login={login}
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

describe('TeamMemberLogin Form Component', () => {
  it('should render a form', () => {
    const {
      getByDisplayValue,
      getByRole,
      getAllByLabelText,
    } = renderComponent();

    expect(getByDisplayValue(EMAIL_TEXT)).toBeInTheDocument();

    expect(getAllByLabelText(PASSWORD_PLACEHOLDER_TEXT).length).toEqual(2);

    expect(getByRole('checkbox', { name: 'I agree with' })).toBeInTheDocument();

    expect(
      getByRole('button', { name: LOGIN_BUTTON_TEXT }),
    ).toBeInTheDocument();
  });

  it('should disable `Accept and Log in` button when form is invalid', () => {
    const { getByRole } = renderComponent();

    expect(getByRole('button', { name: LOGIN_BUTTON_TEXT })).toBeDisabled();
  });

  it('should enable `Accept and Log in` button when form is valid', async () => {
    const { getByRole, getAllByLabelText } = renderComponent();

    const loginButton = getByRole('button', { name: LOGIN_BUTTON_TEXT });

    expect(loginButton).toBeDisabled();

    const passwordFields = getAllByLabelText(PASSWORD_PLACEHOLDER_TEXT);
    passwordFields.forEach(field => userEvent.type(field, PASSWORD_TEXT));

    userEvent.click(getByRole('checkbox', { name: 'I agree with' }));

    await waitFor(() => expect(loginButton).not.toHaveAttribute('disabled'));
  });

  it('should not call `login` function when form is invalid and `Accept and Log in` button clicked', async () => {
    const { getByRole, login } = renderComponent();

    const loginButton = getByRole('button', { name: LOGIN_BUTTON_TEXT });

    userEvent.tab();
    userEvent.click(loginButton);

    expect(login).not.toHaveBeenCalled();
  });

  it('should call `login` function when form is valid and `Accept and Log in` button clicked', async () => {
    const { getByRole, getAllByLabelText, login } = renderComponent();

    const passwordFields = getAllByLabelText(PASSWORD_PLACEHOLDER_TEXT);
    passwordFields.forEach(field => userEvent.type(field, PASSWORD_TEXT));

    userEvent.type(getByRole('textbox', { name: 'Name' }), NAME_TEXT);

    userEvent.click(getByRole('checkbox', { name: 'I agree with' }));

    userEvent.click(getByRole('button', { name: LOGIN_BUTTON_TEXT }));

    await waitFor(() =>
      expect(login).toHaveBeenCalledWith({
        email: EMAIL_TEXT,
        newPassword: PASSWORD_TEXT,
        newPasswordConfirm: PASSWORD_TEXT,
        name: NAME_TEXT,
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
});
