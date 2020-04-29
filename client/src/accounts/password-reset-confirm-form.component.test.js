import React from 'react';

import { render, cleanup, fireEvent } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';

import PasswordResetConfirmForm from './password-reset-confirm-form.component';

const renderComponent = (confirmResetPassword, match, error) =>
  render(
    <MemoryRouter>
      <PasswordResetConfirmForm confirmResetPassword={confirmResetPassword} match={match} error={error} />
    </MemoryRouter>,
  );

describe('Password Reset Form Component', () => {
  let confirmResetPassword = null;
  let match = null;
  let error = null;

  beforeEach(() => {
    fetch.resetMocks();

    confirmResetPassword = jest.fn();
    match = {
      params: {
        uid: 'Test UID',
        token: 'Test Token',
      },
    };
    error = null;
  });

  afterEach(cleanup);

  it('should render a form', () => {
    const { container, getByText, getByPlaceholderText } = renderComponent(confirmResetPassword, match, error);

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByPlaceholderText('New Password')).toBeInTheDocument();
    expect(getByPlaceholderText('New Password Confirmation')).toBeInTheDocument();
    // Check password strength component exists
    expect(getByText('Password Strength:')).toBeInTheDocument();
    // Check form submit button
    expect(getByText('Reset Password')).toBeInTheDocument();
    // Check Terms and Conditions checkbox
    expect(getByText('I agree with')).toBeInTheDocument();
    // Check link to login view
    expect(getByText('Login')).toBeInTheDocument();
    expect(getByText('Reset Password')).toHaveAttribute('disabled');
  });

  it('should enable `Reset` button when form is dirty', async () => {
    const { getByText, getByPlaceholderText } = renderComponent(confirmResetPassword, match, error);

    const password = getByPlaceholderText('New Password');
    expect(password.value).toEqual('');
    fireEvent.change(password, { target: { value: 'newpassword' } });
    expect(password.value).toEqual('newpassword');
    expect(getByText('Reset Password')).toHaveAttribute('disabled');
  });

  it('should enable `Reset Password` button when form is valid', () => {
    const { getByText, getByPlaceholderText } = renderComponent(confirmResetPassword, match, error);

    let password = getByPlaceholderText('New Password');
    fireEvent.change(password, { target: { value: 'newpassword' } });
    expect(password.value).toEqual('newpassword');

    password = getByPlaceholderText('New Password Confirmation');
    fireEvent.change(password, { target: { value: 'newpassword' } });
    expect(password.value).toEqual('newpassword');
    fireEvent.click(getByText('I agree with'));

    expect(getByText('Reset Password')).not.toHaveAttribute('disabled');
  });

  it('should not call `confirmResetPassword` function when form is invalid and `Reset Password` button clicked', () => {
    fetch.mockResponse(JSON.stringify({}, { status: 200 }));

    const { getByText } = renderComponent(confirmResetPassword, match, error);

    fireEvent.click(getByText('Reset Password'));
    expect(fetch.mock.calls.length).toBe(0);
  });

  it('should call `confirmResetPassword` function when form is valid and `Reset Password` button clicked', () => {
    fetch.mockResponse(JSON.stringify({}, { status: 200 }));

    const { getByText, getByPlaceholderText } = renderComponent(confirmResetPassword, match, error);

    fireEvent.change(getByPlaceholderText('New Password'), { target: { value: 'newpassword' } });
    fireEvent.change(getByPlaceholderText('New Password Confirmation'), { target: { value: 'newpassword' } });
    fireEvent.click(getByText('I agree with'));

    fireEvent.click(getByText('Reset Password'));

    const value = undefined;
    expect(confirmResetPassword).toHaveBeenCalledWith(
      {
        new_password1: 'newpassword',
        new_password2: 'newpassword',
        termsAgreed: true,
      },
      {
        token: 'Test Token',
        uid: 'Test UID',
      },
    );
  });
});
