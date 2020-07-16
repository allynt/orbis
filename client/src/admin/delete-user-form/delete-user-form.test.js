import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DeleteUserForm } from './delete-user-form.component';

describe('DeleteUserForm', () => {
  let user = null;
  let deleteCustomerUser = null;
  let close = null;

  beforeEach(() => {
    user = { id: 1, user: { name: 'John Smith' } };
    deleteCustomerUser = jest.fn();
    close = jest.fn();
  });

  it('displays name of user to be deleted in message text', () => {
    const { getByText } = render(
      <DeleteUserForm
        user={user}
        deleteCustomerUser={deleteCustomerUser}
        close={close}
      />,
    );

    expect(getByText(user.user.name)).toBeInTheDocument();
  });

  it('closes when `cancel` button is clicked', () => {
    const { getByText } = render(
      <DeleteUserForm
        user={user}
        deleteCustomerUser={deleteCustomerUser}
        close={close}
      />,
    );
    userEvent.click(getByText('Cancel'));
    expect(close).toHaveBeenCalled();
  });

  it('calls dispatch function with user and closes the dialog when `Yes` button is clicked', () => {
    const { getByText } = render(
      <DeleteUserForm
        user={user}
        deleteCustomerUser={deleteCustomerUser}
        close={close}
      />,
    );
    userEvent.click(getByText('Yes, Send'));
    expect(deleteCustomerUser).toHaveBeenCalledWith(user);
    expect(close).toHaveBeenCalled();
  });
});
