import React from 'react';

import { cleanup, render } from '@testing-library/react';

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
    expect(getByPlaceholderText('Name')).toBeInTheDocument();
    expect(getByText('Update Account')).toBeInTheDocument();
  });

  it('should have `Update User` button enabled', () => {
    const user = {};
    const updateUser = jest.fn();
    const { getByText } = render(<UpdateUserForm user={user} updateUser={updateUser} />);

    expect(getByText('Update Account')).not.toHaveAttribute('disabled');
  });
});
