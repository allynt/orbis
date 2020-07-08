import React from 'react';

import { render } from '@testing-library/react';

import { PendingInvitationsBoard } from './pending-invitations-board.component';

import { customer, pendingUsers } from '../test-story-data';

describe('PendingUsersBoard', () => {
  const cases = [
    ['names', 'name'],
    ["email address'", 'email'],
  ];

  it.each(cases)("Displays all pending user's %s", (_, text) => {
    const { getByText } = render(
      <PendingInvitationsBoard
        pendingUsers={pendingUsers}
        customer={customer}
      />,
    );
    pendingUsers.forEach(user =>
      expect(getByText(user.user[text])).toBeInTheDocument(),
    );
  });

  it('Displays user Orb licence names', () => {
    const { getAllByText } = render(
      <PendingInvitationsBoard
        pendingUsers={pendingUsers}
        customer={customer}
      />,
    );

    expect(getAllByText('Oil, Rice')[0]).toBeInTheDocument();
  });

  it('Displays a placeholder if no customer is present', () => {
    const { getAllByText } = render(
      <PendingInvitationsBoard pendingUsers={pendingUsers} customer={null} />,
    );

    pendingUsers.forEach((user, i) =>
      expect(getAllByText('Not currently available')[i]).toBeInTheDocument(),
    );
  });

  it('Displays a placeholder when customer is present but has no licences', () => {
    const { getAllByText } = render(
      <PendingInvitationsBoard
        pendingUsers={pendingUsers}
        customer={{ name: 'Customer Name' }}
      />,
    );

    pendingUsers.forEach((user, i) =>
      expect(getAllByText('Not currently available')[i]).toBeInTheDocument(),
    );
  });

  describe('Displays a placeholder when there are no pending users', () => {
    const cases = [
      ['undefined', undefined],
      ['null', null],
      ['empty array', []],
    ];

    it.each(cases)('%s', (_, value) => {
      const { getByText } = render(
        <PendingInvitationsBoard pendingUsers={value} customer={customer} />,
      );
      expect(getByText('No Pending Users')).toBeInTheDocument();
    });
  });
});