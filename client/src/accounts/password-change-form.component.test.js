import React from 'react';

import { render, cleanup, fireEvent } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';

import PasswordChangeForm from './password-change-form.component';

describe('Password Reset Form Component', () => {
  let changePassword = null;

  beforeEach(() => {
    changePassword = jest.fn();
  });

  afterEach(cleanup);

  it('should render a form', () => {
    const { container, getByPlaceholderText, getByText, getAllByText } = render(
      <MemoryRouter>
        <PasswordChangeForm changePassword={changePassword} />
      </MemoryRouter>
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByPlaceholderText('Old Password')).toBeInTheDocument();
    expect(getByPlaceholderText('New Password')).toBeInTheDocument();
    expect(getByPlaceholderText('New Password Confirmation')).toBeInTheDocument();
    // Check we use password component with hide/show buttons in the Hide state
    expect(getAllByText('Hide')).toHaveLength(3);
    // Check password strength component exists
    expect(getByText('Password Strength:')).toBeInTheDocument();
    // Check form submit button
    expect(getByText('Change Password')).toBeInTheDocument();
    // Check link to login view
    expect(getByText('Login')).toBeInTheDocument();
    expect(getByText('Change Password')).toHaveAttribute('disabled');
  });

  it('should enable `Change Password` button when form is valid', async () => {
    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        (<PasswordChangeForm changePassword={changePassword} />
      </MemoryRouter>
    );

    let password = getByPlaceholderText('Old Password');
    expect(password.value).toEqual('');
    fireEvent.change(password, { target: { value: 'oldpassword' } });
    expect(password.value).toEqual('oldpassword');

    password = getByPlaceholderText('New Password');
    fireEvent.change(password, { target: { value: 'newpassword' } });
    expect(password.value).toEqual('newpassword');

    password = getByPlaceholderText('New Password Confirmation');
    fireEvent.change(password, { target: { value: 'newpassword' } });
    expect(password.value).toEqual('newpassword');

    expect(getByText('Change Password')).not.toHaveAttribute('disabled');
  });

  it('should keep `Change Password` button disabled when form is invalid', () => {
    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        (<PasswordChangeForm changePassword={changePassword} />
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('Old Password'), { target: { value: 'oldpassword' } });
    fireEvent.change(getByPlaceholderText('New Password'), { target: { value: 'newpassword' } });
    fireEvent.change(getByPlaceholderText('New Password Confirmation'), { target: { value: 'newpasswordconfirm' } });

    expect(getByText('Change Password')).toHaveAttribute('disabled');
  });

  it('should not call `changePassword` function when form is invalid and `Change Password` button clicked', () => {
    const { getByText } = render(
      <MemoryRouter>
        (<PasswordChangeForm changePassword={changePassword} />
      </MemoryRouter>
    );

    fireEvent.click(getByText('Change Password'));
    expect(changePassword).not.toHaveBeenCalled();
  });

  it('should call `changePassword` function when form is valid and `Change Password` button clicked', () => {
    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        (<PasswordChangeForm changePassword={changePassword} />
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('Old Password'), { target: { value: 'oldpassword' } });
    fireEvent.change(getByPlaceholderText('New Password'), { target: { value: 'newpassword' } });
    fireEvent.change(getByPlaceholderText('New Password Confirmation'), { target: { value: 'newpassword' } });

    fireEvent.click(getByText('Change Password'));
    expect(changePassword).toHaveBeenCalled();
  });
});
