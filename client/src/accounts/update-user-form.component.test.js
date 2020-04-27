import React from 'react';

import { cleanup, render, fireEvent } from '@testing-library/react';

import UpdateUserForm from './update-user-form.component';

describe('Update User Form Component', () => {
  afterEach(cleanup);

  it('should render a form', () => {
    const user = {};
    const updateUser = jest.fn();
    const { container, getByText, getByPlaceholderText } = render(
      <UpdateUserForm user={user} updateUser={updateUser} />,
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    expect(getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(getByText('Update Account')).toBeInTheDocument();
  });

  it('should enable `Update User` button when form is valid', () => {
    const user = {};
    const updateUser = jest.fn();
    const { getByText, getByPlaceholderText } = render(<UpdateUserForm user={user} updateUser={updateUser} />);

    fireEvent.change(getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByPlaceholderText('Last Name'), { target: { value: 'John' } });

    expect(getByText('Update Account')).not.toHaveAttribute('disabled');
  });

  it('should not call updateUser function when form is invalid and `Update User` button clicked', () => {
    const user = {};
    const updateUser = jest.fn();
    const { getByText } = render(<UpdateUserForm user={user} updateUser={updateUser} />);

    fireEvent.click(getByText('Update Account'));
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('should call updateUser function when form is valid and `Update User` button clicked', () => {
    const user = {};
    const updateUser = jest.fn();
    const { getByText, getByPlaceholderText } = render(<UpdateUserForm user={user} updateUser={updateUser} />);

    fireEvent.change(getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByPlaceholderText('Last Name'), { target: { value: 'John' } });
    fireEvent.click(getByText('Update Account'));
    expect(updateUser).toHaveBeenCalled();
  });
});
