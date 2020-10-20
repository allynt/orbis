import React from 'react';

import { render, waitFor } from '@testing-library/react';
import UserRegistration from './user-registration.component';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { LOGIN, TERMS } from 'accounts/accounts.constants';

const EMAIL_REGEX = /work\semail\saddress/i;
const FIRST_NAME_REGEX = /first\sname/i;
const LAST_NAME_REGEX = /last\sname/i;
const PASSWORD_REGEX = /^password\*?$/i;
const PASSWORD_CONFIRMATION_REGEX = /password\sconfirmation/i;
const AGREE_CHECKBOX_REGEX = /i\sagree\swith/i;
const SIGN_UP_REGEX = /sign\sup/i;
const LOGIN_REGEX = /login/i;

const renderComponent = ({ serverErrors = [], isLoading = false } = {}) => {
  const onSubmit = jest.fn();
  const history = createMemoryHistory();
  const utils = render(
    <UserRegistration
      onSubmit={onSubmit}
      serverErrors={serverErrors}
      isLoading={isLoading}
    />,
    {
      wrapper: ({ children }) => <Router history={history}>{children}</Router>,
    },
  );
  return { onSubmit, history, ...utils };
};

describe('<UserRegistration />', () => {
  it('shows the user registration form', () => {
    const { getByRole, getByLabelText } = renderComponent();
    expect(getByRole('textbox', { name: EMAIL_REGEX })).toBeInTheDocument();
    expect(
      getByRole('textbox', { name: FIRST_NAME_REGEX }),
    ).toBeInTheDocument();
    expect(getByRole('textbox', { name: LAST_NAME_REGEX })).toBeInTheDocument();
    expect(getByLabelText(PASSWORD_REGEX)).toBeInTheDocument();
    expect(getByLabelText(PASSWORD_CONFIRMATION_REGEX)).toBeInTheDocument();
    expect(
      getByRole('checkbox', { name: AGREE_CHECKBOX_REGEX }),
    ).toBeInTheDocument();
  });

  it('Has a terms and conditions link', () => {
    const { getByRole } = renderComponent();
    expect(
      getByRole('link', { name: /terms\s&\sconditions/i }),
    ).toHaveAttribute('href', TERMS);
  });

  it('enables the Sign Up button when the terms and conditions are agreed', () => {
    const { getByRole } = renderComponent();
    const submitButton = getByRole('button', { name: SIGN_UP_REGEX });
    expect(submitButton).toBeDisabled();
    userEvent.click(getByRole('checkbox', { name: AGREE_CHECKBOX_REGEX }));
    expect(submitButton).not.toBeDisabled();
  });

  it('calls onSubmit with the form values on successful completion', async () => {
    const values = {
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'Person',
      newPassword: 'thisisareallygoodpassword',
      newPasswordConfirm: 'thisisareallygoodpassword',
      acceptedTerms: true,
    };
    const { getByRole, getByLabelText, onSubmit } = renderComponent();
    userEvent.type(getByRole('textbox', { name: EMAIL_REGEX }), values.email);
    userEvent.type(
      getByRole('textbox', { name: FIRST_NAME_REGEX }),
      values.firstName,
    );
    userEvent.type(
      getByRole('textbox', { name: LAST_NAME_REGEX }),
      values.lastName,
    );
    userEvent.type(getByLabelText(PASSWORD_REGEX), values.newPassword);
    userEvent.type(
      getByLabelText(PASSWORD_CONFIRMATION_REGEX),
      values.newPasswordConfirm,
    );
    userEvent.click(getByRole('checkbox', { name: AGREE_CHECKBOX_REGEX }));
    userEvent.click(getByRole('button', { name: SIGN_UP_REGEX }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        ...values,
      }),
    );
  });

  it('navigates to login when the login link is clicked', () => {
    const { history, getByRole } = renderComponent();
    userEvent.click(getByRole('link', { name: LOGIN_REGEX }));
    expect(history.location.pathname).toBe(LOGIN);
  });

  it('displays server errors if there are any', () => {
    const { getByText } = renderComponent({
      serverErrors: ['test error'],
    });
    expect(getByText(/test\serror/i)).toBeInTheDocument();
  });

  it('shows a loading spinner when loading', () => {
    const { getByRole } = renderComponent({
      isLoading: true,
    });
    expect(getByRole('alert')).toBeInTheDocument();
  });
});
