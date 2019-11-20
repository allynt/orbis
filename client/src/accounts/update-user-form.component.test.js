import React from 'react';

import { cleanup, render, fireEvent } from '@testing-library/react';

import UpdateUserForm from './update-user-form.component';

describe('Update User Form Component', () => {
  afterEach(cleanup);

  it('should render a form', () => {
    const user = {};
    const updateUser = jest.fn();
    const { container, getByText, getByPlaceholderText } = render(
      <UpdateUserForm user={user} updateUser={updateUser} />
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    expect(getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(getByText('Update User')).toBeInTheDocument();
  });

  it('should enable `Reset` button when form is dirty', async () => {
    const user = {};
    const updateUser = jest.fn();
    const { getByPlaceholderText } = render(<UpdateUserForm user={user} updateUser={updateUser} />);

    const firstName = getByPlaceholderText('First Name');
    expect(firstName.value).toEqual('');
    fireEvent.change(firstName, { target: { value: 'John' } });
    expect(firstName.value).toEqual('John');
  });

  it('should enable `Update User` button when form is valid', () => {
    const user = {};
    const updateUser = jest.fn();
    const { getByText, getByPlaceholderText } = render(<UpdateUserForm user={user} updateUser={updateUser} />);

    fireEvent.change(getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByPlaceholderText('Last Name'), { target: { value: 'John' } });

    expect(getByText('Update User')).not.toHaveAttribute('disabled');
  });

  it('should not call updateUser function when form is invalid and `Update User` button clicked', () => {
    const user = {};
    const updateUser = jest.fn();
    const { getByText } = render(<UpdateUserForm user={user} updateUser={updateUser} />);

    fireEvent.click(getByText('Update User'));
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('should call updateUser function when form is valid and `Update User` button clicked', () => {
    const user = {};
    const updateUser = jest.fn();
    const { getByText, getByPlaceholderText } = render(<UpdateUserForm user={user} updateUser={updateUser} />);

    fireEvent.change(getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByPlaceholderText('Last Name'), { target: { value: 'John' } });
    fireEvent.click(getByText('Update User'));
    expect(updateUser).toHaveBeenCalled();
  });
});
