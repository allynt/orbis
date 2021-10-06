import React from 'react';

import { render, screen, userEvent, waitFor } from 'test/test-utils';

import UserRegistration from './user-registration.component';

const EMAIL_REGEX = /work\semail\saddress/i;
const FIRST_NAME_REGEX = /first\sname/i;
const LAST_NAME_REGEX = /last\sname/i;
const ORGANISATION_NAME_REGEX = /organisation\sname/i;
const PASSWORD_REGEX = /password \*$/i;
const PASSWORD_CONFIRMATION_REGEX = /password\sconfirmation/i;
const AGREE_CHECKBOX_REGEX = /i\sagree\swith/i;
const SIGN_UP_REGEX = /sign\sup/i;

describe('<UserRegistration />', () => {
  it('shows the user registration form', () => {
    render(<UserRegistration />);

    expect(
      screen.getByRole('textbox', { name: EMAIL_REGEX }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: FIRST_NAME_REGEX }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: LAST_NAME_REGEX }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: ORGANISATION_NAME_REGEX }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(PASSWORD_REGEX)).toBeInTheDocument();
    expect(
      screen.getByLabelText(PASSWORD_CONFIRMATION_REGEX),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: AGREE_CHECKBOX_REGEX }),
    ).toBeInTheDocument();
  });

  it('Has a terms and conditions link', () => {
    render(<UserRegistration />);

    expect(
      screen.getByRole('link', { name: /terms\s&\sconditions/i }),
    ).toHaveAttribute('href', expect.stringContaining('TERMS'));
  });

  it('enables the Sign Up button when the terms and conditions are agreed', () => {
    render(<UserRegistration />);

    expect(screen.getByRole('button', { name: SIGN_UP_REGEX })).toBeDisabled();
    userEvent.click(
      screen.getByRole('checkbox', { name: AGREE_CHECKBOX_REGEX }),
    );
    expect(
      screen.getByRole('button', { name: SIGN_UP_REGEX }),
    ).not.toBeDisabled();
  });

  it('calls onSubmit with the form values on successful completion', async () => {
    const onSubmit = jest.fn();
    const values = {
      email: 'test@test.com',
      name: 'Test Person',
      organisationName: 'Weyland-Yutani',
      newPassword: 'thisisareallygoodpassword',
      newPasswordConfirm: 'thisisareallygoodpassword',
      acceptedTerms: true,
    };

    render(<UserRegistration onSubmit={onSubmit} />);

    userEvent.type(
      screen.getByRole('textbox', { name: EMAIL_REGEX }),
      values.email,
    );
    userEvent.type(
      screen.getByRole('textbox', { name: FIRST_NAME_REGEX }),
      'Test',
    );
    userEvent.type(
      screen.getByRole('textbox', { name: LAST_NAME_REGEX }),
      'Person',
    );
    userEvent.type(
      screen.getByRole('textbox', { name: ORGANISATION_NAME_REGEX }),
      values.organisationName,
    );
    userEvent.type(screen.getByLabelText(PASSWORD_REGEX), values.newPassword);
    userEvent.type(
      screen.getByLabelText(PASSWORD_CONFIRMATION_REGEX),
      values.newPasswordConfirm,
    );
    userEvent.click(
      screen.getByRole('checkbox', { name: AGREE_CHECKBOX_REGEX }),
    );
    userEvent.click(screen.getByRole('button', { name: SIGN_UP_REGEX }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        ...values,
      }),
    );
  });

  it('displays server errors if there are any', () => {
    render(<UserRegistration serverErrors={['test error']} />);

    expect(screen.getByText(/test\serror/i)).toBeInTheDocument();
  });

  it('shows a loading spinner when loading', () => {
    render(<UserRegistration isLoading={true} />);

    expect(screen.getAllByRole('progressbar')[1]).toBeInTheDocument();
  });
});
