import React from 'react';
import { render } from '@testing-library/react';

import { customer, activeUsers } from '../test-story-data';

import { ActiveUsersBoard } from './active-users-board.component';

describe('ActiveUsersBoard', () => {
  const cases = [
    ['names', 'name'],
    ["email address'", 'email'],
  ];

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
