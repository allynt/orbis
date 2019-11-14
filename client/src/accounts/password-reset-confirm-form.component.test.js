import React from 'react';

import { render, cleanup, fireEvent } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';

import PasswordResetConfirmForm from './password-reset-confirm-form.component';

describe('Password Reset Form Component', () => {
  let confirmChangePassword = null;
  let routerProps = null;

  beforeEach(() => {
    confirmChangePassword = jest.fn();
    routerProps = {
      match: {
        params: {}
      }
    };
  });

  afterEach(cleanup);

  it('should render a form', () => {
    const { container, getByText, getAllByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <PasswordResetConfirmForm confirmChangePassword={confirmChangePassword} routerProps={routerProps} />
      </MemoryRouter>
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByPlaceholderText('New Password')).toBeInTheDocument();
    expect(getByPlaceholderText('New Password Confirmation')).toBeInTheDocument();
    // Check we use password component with hide/show buttons in the Hide state
    expect(getAllByText('Hide')).toHaveLength(2);
    // Check password strength component exists
    expect(getByText('Password Strength:')).toBeInTheDocument();
    // Check form submit button
    expect(getByText('Reset Password')).toBeInTheDocument();
    // Check link to login view
    expect(getByText('Login')).toBeInTheDocument();
    expect(getByText('Reset Password')).toHaveAttribute('disabled');
  });

  it('should enable `Reset` button when form is dirty', async () => {
    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <PasswordResetConfirmForm confirmChangePassword={confirmChangePassword} routerProps={routerProps} />
      </MemoryRouter>
    );

    const password = getByPlaceholderText('New Password');
    expect(password.value).toEqual('');
    fireEvent.change(password, { target: { value: 'newpassword' } });
    expect(password.value).toEqual('newpassword');
    expect(getByText('Reset Password')).toHaveAttribute('disabled');
  });

  it('should enable `Reset Password` button when form is valid', () => {
    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <PasswordResetConfirmForm confirmChangePassword={confirmChangePassword} routerProps={routerProps} />
      </MemoryRouter>
    );

    let password = getByPlaceholderText('New Password');
    fireEvent.change(password, { target: { value: 'newpassword' } });
    expect(password.value).toEqual('newpassword');

    password = getByPlaceholderText('New Password Confirmation');
    fireEvent.change(password, { target: { value: 'newpassword' } });
    expect(password.value).toEqual('newpassword');

    expect(getByText('Reset Password')).not.toHaveAttribute('disabled');
  });

  it('should not call `confirmChangePassword` function when form is invalid and `Reset Password` button clicked', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PasswordResetConfirmForm confirmChangePassword={confirmChangePassword} routerProps={routerProps} />
      </MemoryRouter>
    );

    fireEvent.click(getByText('Reset Password'));
    expect(confirmChangePassword).not.toHaveBeenCalled();
  });

  it('should call `confirmChangePassword` function when form is valid and `Reset Password` button clicked', () => {
    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <PasswordResetConfirmForm confirmChangePassword={confirmChangePassword} routerProps={routerProps} />
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('New Password'), { target: { value: 'newpassword' } });
    fireEvent.change(getByPlaceholderText('New Password Confirmation'), { target: { value: 'newpassword' } });

    fireEvent.click(getByText('Reset Password'));
    expect(confirmChangePassword).toHaveBeenCalled();
  });
});
