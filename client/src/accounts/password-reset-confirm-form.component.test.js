import React from 'react';

import { render, cleanup, fireEvent } from '@testing-library/react';

import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import PasswordResetConfirmForm from './password-reset-confirm-form.component';
import { status } from './accounts.slice';

const renderComponent = (
  history,
  confirmResetPassword,
  resetStatus,
  match,
  error,
) =>
  render(
    <Router history={history}>
      <PasswordResetConfirmForm
        confirmResetPassword={confirmResetPassword}
        resetStatus={resetStatus}
        match={match}
        error={error}
      />
    </Router>,
  );

describe('Password Reset Form Component', () => {
  let history = null;
  let confirmResetPassword = null;
  let resetStatus = null;
  let match = null;
  let error = null;

  beforeEach(() => {
    fetch.resetMocks();

    history = createMemoryHistory({ initialEntries: ['/'] });
    confirmResetPassword = jest.fn();
    resetStatus = status.NONE;
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
    const { container, getByText, getByPlaceholderText } = renderComponent(
      history,
      confirmResetPassword,
      resetStatus,
      match,
      error,
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByPlaceholderText('New Password')).toBeInTheDocument();
    expect(
      getByPlaceholderText('New Password Confirmation'),
    ).toBeInTheDocument();
    // Check form submit button
    expect(getByText('Reset Password')).toBeInTheDocument();
    // Check Terms and Conditions checkbox
    expect(getByText('I agree with')).toBeInTheDocument();
    // Check link to login view
    expect(getByText('Login')).toBeInTheDocument();
    expect(getByText('Reset Password')).toHaveAttribute('disabled');
  });

  it('should disable `Reset` button when form is dirty', async () => {
    const { getByText, getByPlaceholderText } = renderComponent(
      history,
      confirmResetPassword,
      resetStatus,
      match,
      error,
    );

    const password = getByPlaceholderText('New Password');
    expect(password.value).toEqual('');
    fireEvent.change(password, { target: { value: 'newpassword' } });
    expect(password.value).toEqual('newpassword');
    expect(getByText('Reset Password')).toHaveAttribute('disabled');
  });

  it('should enable `Reset Password` button when form is valid', () => {
    const { getByText, getByPlaceholderText } = renderComponent(
      history,
      confirmResetPassword,
      resetStatus,
      match,
      error,
    );

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

    const { getByText } = renderComponent(
      history,
      confirmResetPassword,
      resetStatus,
      match,
      error,
    );

    fireEvent.click(getByText('Reset Password'));
    expect(fetch.mock.calls.length).toBe(0);
  });

  it('should call `confirmResetPassword` function and redirect to login when form is valid and `Reset Password` button clicked', () => {
    fetch.mockResponse(JSON.stringify({}, { status: 200 }));

    const { getByText, getByPlaceholderText } = renderComponent(
      history,
      confirmResetPassword,
      resetStatus,
      match,
      error,
    );

    fireEvent.change(getByPlaceholderText('New Password'), {
      target: { value: 'newpassword' },
    });
    fireEvent.change(getByPlaceholderText('New Password Confirmation'), {
      target: { value: 'newpassword' },
    });
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

  it('should not redirect, but display error well if password reset is unsucessful', () => {
    resetStatus = status.NONE;
    error = ['Test Error 1', 'Test Error 2', 'Test Error 3'];

    const { getByTestId } = renderComponent(
      history,
      confirmResetPassword,
      resetStatus,
      match,
      error,
    );

    expect(history.location.pathname).toEqual('/');
    expect(getByTestId('error-well')).toBeInTheDocument();
  });
});
