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

  xit.each(cases)("Displays all active user's %s", (_, text) => {
    const { getByText } = render(
      <ActiveUsersBoard
        activeCustomerUsers={activeUsers}
        customer={customer}
      />,
    );
    activeUsers.forEach(user =>
      expect(getByText(user.user[text])).toBeInTheDocument(),
    );
  });

  xit('Displays user Orb licence names', () => {
    const { getAllByText } = render(
      <ActiveUsersBoard
        activeCustomerUsers={activeUsers}
        customer={customer}
      />,
    );

    expect(getAllByText('Oil, Rice')[0]).toBeInTheDocument();
  });

  xit('Displays a placeholder when customer is present but has no licences', () => {
    const { getAllByText, queryByText } = render(
      <ActiveUsersBoard
        activeCustomerUsers={activeUsers}
        customer={{ name: 'Customer Name' }}
      />,
    );

    expect(queryByText('No licences')).not.toBeInTheDocument();

    activeUsers.forEach((_, i) =>
      expect(getAllByText('Not currently available')[i]).toBeInTheDocument(),
    );
  });

  xit('Displays a placeholder when user has no licences', () => {
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
    const { queryByTestId, getByText } = render(
      <ActiveUsersBoard
        activeCustomerUsers={activeUsers}
        oneAdminRemaining={true}
        customer={customer}
      />,
    );
    expect(queryByTestId('test-id-123')).toBeDisabled();
  });

  xit('Calls `changeRole` function with user when buttons are clicked', () => {
    const MEMBER = {
      id: 1,
      type: 'MEMBER',
      user: { id: '123', name: 'Steve Brown' },
    };

    const { getByRole, getByText, getAllByText } = render(
      <ActiveUsersBoard
        activeCustomerUsers={activeUsers}
        customer={customer}
        onChangeRoleClick={onChangeRoleClick}
      />,
    );

    userEvent.click(getByRole('button', { name: 'Standard' }));

    expect(getAllByText('Admin').length).toEqual(2);

    userEvent.click(getAllByText('Admin')[1]);
    expect(onChangeRoleClick).toHaveBeenCalledWith(MEMBER);
  });

  xit('Calls `editCustomerUser` function with user when buttons are clicked', () => {
    const USER = {
      id: 1,
      type: 'MEMBER',
      user: { id: '123', name: 'Steve Brown' },
    };

    const { getByText, getAllByTestId } = render(
      <ActiveUsersBoard
        currentUser={{ id: '456' }}
        activeCustomerUsers={[
          { id: 1, type: 'MANAGER', user: { id: '456', name: 'John Smith' } },
          USER,
        ]}
        customer={customer}
        onEditUserClick={onEditUserClick}
      />,
    );

    userEvent.click(getAllByTestId('options-icon')[1]);
    expect(getByText('Edit')).toBeInTheDocument();

    userEvent.click(getByText('Edit'));
    expect(onEditUserClick).toHaveBeenCalledWith(USER);
  });

  xit('Does not show `Delete User` button for currently logged-in user', () => {
    const { queryByText, getByText, getAllByTestId } = render(
      <ActiveUsersBoard
        customer={customer}
        currentUser={{ id: '123' }}
        activeCustomerUsers={[
          { id: 1, type: 'MANAGER', user: { id: '123', name: 'John Smith' } },
          { id: 2, type: 'MEMBER', user: { id: '456', name: 'Steve Brown' } },
        ]}
      />,
    );

    userEvent.click(getAllByTestId('options-icon')[0]);
    expect(queryByText('Delete User')).not.toBeInTheDocument();

    userEvent.click(getAllByTestId('options-icon')[1]);
    expect(getByText('Delete User')).toBeInTheDocument();
  });

  xit('Calls `deleteCustomerUser` function with user when buttons are clicked', () => {
    const USER = {
      id: 1,
      type: 'MEMBER',
      user: { id: '123', name: 'Steve Brown' },
    };

    const { getByText, getAllByTestId } = render(
      <ActiveUsersBoard
        currentUser={{ id: '456' }}
        activeCustomerUsers={[
          { id: 2, type: 'MANAGER', user: { id: '456', name: 'John Smith' } },
          USER,
        ]}
        customer={customer}
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

    xit.each(cases)('%s', (_, value) => {
      const { getByText } = render(
        <ActiveUsersBoard activeCustomerUsers={value} customer={customer} />,
      );
      expect(getByText('No rows')).toBeInTheDocument();
    });
  });
});
