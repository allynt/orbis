import React from 'react';
import { render } from '@testing-library/react';

import { customer, activeUsers } from '../test-story-data';

import { ActiveUsersBoard } from './active-users-board.component';
import userEvent from '@testing-library/user-event';

describe('ActiveUsersBoard', () => {
  const cases = [
    ['names', 'name'],
    ["email address'", 'email'],
  ];
  const onChangeRoleClick = jest.fn();

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
    const { getAllByText } = render(
      <ActiveUsersBoard
        activeUsers={activeUsers}
        customer={{ name: 'Customer Name' }}
      />,
    );

    activeUsers.forEach((user, i) =>
      expect(getAllByText('Not currently available')[i]).toBeInTheDocument(),
    );
  });

  it('Disables `Change Role` button when only 1 admin remains', () => {
    const { getByText } = render(
      <ActiveUsersBoard
        activeUsers={[
          { type: 'MANAGER', user: { name: 'John Smith' } },
          { type: 'MEMBER', user: { name: 'Steve Brown' } },
        ]}
        customer={{ name: 'Customer Name' }}
      />,
    );

    const button = getByText('Admin');
    expect(button).toHaveAttribute('disabled');
  });

  it('Calls `changeRole` function with user when buttons are clicked', () => {
    const MEMBER = { type: 'MEMBER', user: { name: 'Steve Brown' } };

    const { getByText, getByTestId } = render(
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

    const changeRoleButton = getByTestId('options-dropdown-button');
    expect(changeRoleButton).toBeInTheDocument();

    userEvent.click(changeRoleButton);
    expect(onChangeRoleClick).toHaveBeenCalledWith(MEMBER);
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
