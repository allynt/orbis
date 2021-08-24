import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customer, activeUsers } from 'mission-control/test-story-data';

import { ActiveUsersBoard } from './active-users-board.component';

describe('ActiveUsersBoard', () => {
  const cases = [
    ['names', 'name'],
    ["email address'", 'email'],
  ];
  const onChangeRoleClick = jest.fn();
  const onEditUserClick = jest.fn();
  const onDeleteUserClick = jest.fn();

  it.skip.each(cases)("Displays all active user's %s", (_, text) => {
    const { getByText } = render(
      <ActiveUsersBoard
        activeCustomerUsers={activeUsers}
        customer={customer}
      />,
    );
    activeUsers.forEach((user, i) => {
      if (i <= 4) {
        expect(getByText(user.user[text])).toBeInTheDocument();
      } else {
        userEvent.click(getByText('Next'));
        expect(getByText(user.user[text])).toBeInTheDocument();
      }
    });
  });

  it('Displays user Orb licence names', () => {
    const { getAllByText } = render(
      <ActiveUsersBoard
        activeCustomerUsers={activeUsers}
        customer={customer}
      />,
    );

    expect(getAllByText('Oil, Rice')[0]).toBeInTheDocument();
  });

  it('Displays a placeholder when customer is present but has no licences', () => {
    const { queryAllByText, queryByText } = render(
      <ActiveUsersBoard
        activeCustomerUsers={activeUsers}
        customer={{ name: 'Customer Name' }}
      />,
    );

    expect(queryByText('No licences')).not.toBeInTheDocument();

    activeUsers.slice(0, 5).forEach((u, i) => {
      expect(queryAllByText('Not currently available')[i]).toBeInTheDocument();
    });
  });

  it('Displays a placeholder when user has no licences', () => {
    const TEST_USER = {
      ...activeUsers[0],
      id: '99',
    };

    const { getByText, queryByText } = render(
      <ActiveUsersBoard
        activeCustomerUsers={[TEST_USER]}
        customer={customer}
      />,
    );

    expect(queryByText('Not currently available')).not.toBeInTheDocument();
    expect(getByText('No licences')).toBeInTheDocument();
  });

  it('Disables `Change Role` button when only 1 admin remains', () => {
    const { getByRole } = render(
      <ActiveUsersBoard
        activeCustomerUsers={[
          { type: 'MANAGER', user: { id: '123', name: 'John Smith' } },
          { type: 'MEMBER', user: { id: '456', name: 'Steve Brown' } },
        ]}
        oneAdminRemaining={true}
        customer={{ name: 'Customer Name' }}
      />,
    );
    expect(getByRole('button', { name: 'Admin' })).toBeDisabled();
  });

  it('Calls `changeRole` function with user when buttons are clicked', () => {
    const MEMBER = { type: 'MEMBER', user: { id: '123', name: 'Steve Brown' } };

    const { getByText, getAllByText } = render(
      <ActiveUsersBoard
        activeCustomerUsers={[
          { type: 'MANAGER', user: { id: '456', name: 'John Smith' } },
          MEMBER,
        ]}
        customer={{ name: 'Customer Name' }}
        onChangeRoleClick={onChangeRoleClick}
      />,
    );

    userEvent.click(getByText('Standard'));

    expect(getAllByText('Admin').length).toEqual(2);

    userEvent.click(getAllByText('Admin')[1]);
    expect(onChangeRoleClick).toHaveBeenCalledWith(MEMBER);
  });

  it('Calls `editCustomerUser` function with user when buttons are clicked', () => {
    const USER = { type: 'MEMBER', user: { id: '123', name: 'Steve Brown' } };

    const { getByText, getAllByTestId } = render(
      <ActiveUsersBoard
        currentUser={{ id: '456' }}
        activeCustomerUsers={[
          { type: 'MANAGER', user: { id: '456', name: 'John Smith' } },
          USER,
        ]}
        customer={{ name: 'Customer Name' }}
        onEditUserClick={onEditUserClick}
      />,
    );

    userEvent.click(getAllByTestId('options-icon')[1]);
    expect(getByText('Edit')).toBeInTheDocument();

    userEvent.click(getByText('Edit'));
    expect(onEditUserClick).toHaveBeenCalledWith(USER);
  });

  it('Does not show `Delete User` button for currently logged-in user', () => {
    const { queryByText, getByText, getAllByTestId } = render(
      <ActiveUsersBoard
        currentUser={{ id: '123' }}
        activeCustomerUsers={[
          { type: 'MANAGER', user: { id: '123', name: 'John Smith' } },
          { type: 'MEMBER', user: { id: '456', name: 'Steve Brown' } },
        ]}
      />,
    );

    userEvent.click(getAllByTestId('options-icon')[0]);
    expect(queryByText('Delete User')).not.toBeInTheDocument();

    userEvent.click(getAllByTestId('options-icon')[1]);
    expect(getByText('Delete User')).toBeInTheDocument();
  });

  it('Calls `deleteCustomerUser` function with user when buttons are clicked', () => {
    const USER = { type: 'MEMBER', user: { id: '123', name: 'Steve Brown' } };

    const { getByText, getAllByTestId } = render(
      <ActiveUsersBoard
        currentUser={{ id: '456' }}
        activeCustomerUsers={[
          { type: 'MANAGER', user: { id: '456', name: 'John Smith' } },
          USER,
        ]}
        customer={{ name: 'Customer Name' }}
        onDeleteUserClick={onDeleteUserClick}
      />,
    );

    userEvent.click(getAllByTestId('options-icon')[1]);
    expect(getByText('Delete User')).toBeInTheDocument();

    userEvent.click(getByText('Delete User'));
    expect(onDeleteUserClick).toHaveBeenCalledWith(USER);
  });
});
