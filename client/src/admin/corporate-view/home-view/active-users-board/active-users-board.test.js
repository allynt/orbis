import React from 'react';
import { render } from '@testing-library/react';

import { customer, activeUsers } from '../../../test-story-data';

import { ActiveUsersBoard } from './active-users-board.component';
import userEvent from '@testing-library/user-event';

describe('ActiveUsersBoard', () => {
  const cases = [
    ['names', 'name'],
    ["email address'", 'email'],
  ];
  const onChangeRoleClick = jest.fn();
  const onEditUserClick = jest.fn();
  const onDeleteUserClick = jest.fn();

  it.each(cases)("Displays all active user's %s", (_, text) => {
    const { getByText } = render(
      <ActiveUsersBoard activeUsers={activeUsers} customer={customer} />,
    );
    activeUsers.forEach(user =>
      expect(getByText(user.user[text])).toBeInTheDocument(),
    );
  });

  it('Displays user Orb licence names', () => {
    const { getAllByText } = render(
      <ActiveUsersBoard activeUsers={activeUsers} customer={customer} />,
    );

    expect(getAllByText('Oil, Rice')[0]).toBeInTheDocument();
  });

  it('Displays a placeholder when customer is present but has no licences', () => {
    const { getAllByText, queryByText } = render(
      <ActiveUsersBoard
        activeUsers={activeUsers}
        customer={{ name: 'Customer Name' }}
      />,
    );

    expect(queryByText('No licences')).not.toBeInTheDocument();

    activeUsers.forEach((user, i) =>
      expect(getAllByText('Not currently available')[i]).toBeInTheDocument(),
    );
  });

  it('Displays a placeholder when user has no licences', () => {
    const TEST_USER = {
      ...activeUsers[0],
      id: '99',
    };

    const { getByText, queryByText } = render(
      <ActiveUsersBoard activeUsers={[TEST_USER]} customer={customer} />,
    );

    expect(queryByText('Not currently available')).not.toBeInTheDocument();
    expect(getByText('No licences')).toBeInTheDocument();
  });

  it('Disables `Change Role` button when only 1 admin remains', () => {
    const { getByText } = render(
      <ActiveUsersBoard
        activeUsers={[
          { type: 'MANAGER', user: { name: 'John Smith' } },
          { type: 'MEMBER', user: { name: 'Steve Brown' } },
        ]}
        oneAdminRemaining={true}
        customer={{ name: 'Customer Name' }}
      />,
    );

    const button = getByText('Admin');
    expect(button).toHaveAttribute('disabled');
  });

  it('Calls `changeRole` function with user when buttons are clicked', () => {
    const MEMBER = { type: 'MEMBER', user: { name: 'Steve Brown' } };

    const { getByText, getAllByText } = render(
      <ActiveUsersBoard
        activeUsers={[
          { type: 'MANAGER', user: { name: 'John Smith' } },
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
        activeUsers={[{ type: 'MANAGER', user: { name: 'John Smith' } }, USER]}
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
        activeUsers={[
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
        activeUsers={[{ type: 'MANAGER', user: { name: 'John Smith' } }, USER]}
        customer={{ name: 'Customer Name' }}
        onDeleteUserClick={onDeleteUserClick}
      />,
    );

    userEvent.click(getAllByTestId('options-icon')[1]);
    expect(getByText('Delete User')).toBeInTheDocument();

    userEvent.click(getByText('Delete User'));
    expect(onDeleteUserClick).toHaveBeenCalledWith(USER);
  });

  describe('Displays a placeholder when there are no active users', () => {
    const cases = [
      ['undefined', undefined],
      ['null', null],
      ['empty array', []],
    ];

    it.each(cases)('%s', (_, value) => {
      const { getByText } = render(
        <ActiveUsersBoard activeUsers={value} customer={customer} />,
      );
      expect(getByText('No Active Users')).toBeInTheDocument();
    });
  });
});
