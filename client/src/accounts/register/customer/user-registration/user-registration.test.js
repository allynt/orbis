import React from 'react';

import { render } from '@testing-library/react';
import UserRegistration from './user-registration.component';
import userEvent from '@testing-library/user-event';

const EMAIL_REGEX = /work\semail\saddress/i;
const FIRST_NAME_REGEX = /first\sname/i;
const LAST_NAME_REGEX = /last\sname/i;
const PASSWORD_REGEX = /password/i;
const PASSWORD_CONFIRMATION_REGEX = /password\sconfirmation/i;
const AGREE_CHECKBOX_REGEX = /i\sagree\swith/i;
const SIGN_UP_REGEX = /sign\sup/i;
const LOGIN_REGEX = /login/i;

const renderComponent = () => {
  const onSubmit = jest.fn();
  const utils = render(<UserRegistration onSubmit={onSubmit} />);
  return { onSubmit, ...utils };
};

describe.only('<UserRegistration />', () => {
  it('shows the user registration form', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('textbox', { name: EMAIL_REGEX })).toBeInTheDocument();
    expect(
      getByRole('textbox', { name: FIRST_NAME_REGEX }),
    ).toBeInTheDocument();
    expect(getByRole('textbox', { name: LAST_NAME_REGEX })).toBeInTheDocument();
    expect(getByRole('textbox', { name: PASSWORD_REGEX })).toBeInTheDocument();
    expect(
      getByRole('textbox', { name: PASSWORD_CONFIRMATION_REGEX }),
    ).toBeInTheDocument();
    expect(
      getByRole('checkbox', { name: AGREE_CHECKBOX_REGEX }),
    ).toBeInTheDocument();
  });

  it('enables the Sign Up button when the terms and conditions are agreed', () => {
    const { getByRole } = renderComponent();
    const submitButton = getByRole('button', { name: SIGN_UP_REGEX });
    expect(submitButton).toBeDisabled();
    userEvent.click(getByRole('checkbox', { name: AGREE_CHECKBOX_REGEX }));
    expect(submitButton).not.toBeDisabled();
  });

  it('calls onSubmit with the form values on successful completion', () => {
    const values = {
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'Person',
      newPassword: 'thisisareallygoodpassword',
      newPasswordConfirm: 'thisisareallygoodpassword',
      acceptedTerms: true,
    };
    const { getByRole, onSubmit } = renderComponent();
    userEvent.type(getByRole('textbox', { name: EMAIL_REGEX }), values.email);
    userEvent.type(
      getByRole('textbox', { name: FIRST_NAME_REGEX }),
      values.firstName,
    );
    userEvent.type(
      getByRole('textbox', { name: LAST_NAME_REGEX }),
      values.lastName,
    );
    userEvent.type(
      getByRole('textbox', { name: PASSWORD_REGEX }),
      values.newPassword,
    );
    userEvent.type(
      getByRole('textbox', { name: PASSWORD_CONFIRMATION_REGEX }),
      values.newPasswordConfirm,
    );
    userEvent.click(getByRole('checkbox', { name: AGREE_CHECKBOX_REGEX }));
    userEvent.click(getByRole('button', { name: SIGN_UP_REGEX }));
    expect(onSubmit).toHaveBeenCalledWith({
      values,
    });
  });

  it.todo('navigates to login when the login link is clicked');
});
