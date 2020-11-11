import React from 'react';

import { cleanup, render } from '@testing-library/react';

import UpdateUserForm from './update-user-form.component';

describe('Update User Form Component', () => {
  afterEach(cleanup);

  it('should render a form', () => {
    const user = {};
    const updateUser = jest.fn();
    const { getByRole } = render(
      <UpdateUserForm user={user} updateUser={updateUser} />,
    );

    expect(getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
    expect(getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Update Account' })).toBeInTheDocument();
  });

  it('should have `Update User` button enabled', () => {
    const user = {};
    const updateUser = jest.fn();
    const { getByRole } = render(
      <UpdateUserForm user={user} updateUser={updateUser} />,
    );

    expect(getByRole('button', { name: 'Update Account' })).not.toBeDisabled();
  });
});
