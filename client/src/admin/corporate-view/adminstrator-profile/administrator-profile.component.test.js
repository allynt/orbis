import React from 'react';

import { cleanup, render, waitFor } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import AdministratorProfile from './administrator-profile.component';

const renderComponent = (user, updateAdministrator) =>
  render(
    <AdministratorProfile
      user={user}
      updateAdministrator={updateAdministrator}
    />,
  );

describe('Update User Form Component', () => {
  let updateAdministrator = null;
  let user = null;

  beforeEach(() => {
    updateAdministrator = jest.fn();
    user = {
      name: 'John Smith',
      email: 'jsmith@gmail.com',
      phone: '12345',
      avatar: 'TestURL',
    };
  });

  afterEach(cleanup);

  it('should render the Administrator Form, pre-populated with the customer`s information if it exists', () => {
    const { container, getByAltText, getByDisplayValue } = renderComponent(
      user,
      updateAdministrator,
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByAltText('Admin Avatar')).toBeInTheDocument();

    expect(getByDisplayValue(user.name)).toBeInTheDocument();
    expect(getByDisplayValue(user.email)).toBeInTheDocument();
    expect(getByDisplayValue(user.phone)).toBeInTheDocument();
  });

  it('should dispatch new values when `Update Changes` button is clicked', () => {
    const { getByText, getByDisplayValue } = renderComponent(
      user,
      updateAdministrator,
    );

    const newUser = {
      ...user,
      name: 'Steve Brown',
    };

    const nameField = getByDisplayValue(user.name);

    userEvent.clear(nameField);
    userEvent.type(nameField, 'Steve Brown');
    userEvent.click(getByText('Update Changes'));

    waitFor(() => expect(updateAdministrator).toHaveBeenCalledWith(newUser));
  });

  it('should disable `Update Changes` button unless no changes have been made', () => {
    const { getByText, getByDisplayValue } = renderComponent(
      user,
      updateAdministrator,
    );

    const nameField = getByDisplayValue(user.name);

    expect(getByText('Update Changes')).toHaveAttribute('disabled');
    userEvent.type(nameField, 'aaa');
    expect(getByText('Update Changes')).not.toHaveAttribute('disabled');
  });
});
