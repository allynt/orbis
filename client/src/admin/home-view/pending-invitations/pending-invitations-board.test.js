import React from 'react';
import { render } from '@testing-library/react';
import PendingInvitationsBoard from './pending-invitations-board.component';

const pendingUsers = [
  {
    licences: ['one', 'two'],
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test One', email: 'test1@test.com' },
  },
  {
    licences: ['three', 'four'],
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test Two', email: 'test2@test.com' },
  },
  {
    licences: ['five', 'six'],
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test Three', email: 'test3@test.com' },
  },
];

describe('ActiveUsersBoard', () => {
  const cases = [
    ['names', 'name'],
    ['assigned licences', 'licences'],
    ["email address'", 'email'],
  ];

  it.each(cases)("Displays all active user's %s", (_, text) => {
    const { getByText } = render(<PendingInvitationsBoard pendingUsers={pendingUsers} />);
    pendingUsers.forEach(user =>
      expect(getByText(text === 'licences' ? user[text].sort().join(', ') : user.user[text])).toBeInTheDocument(),
    );
  });

  describe('Displays a placeholder when there are no active users', () => {
    const cases = [
      ['undefined', undefined],
      ['null', null],
      ['empty array', []],
    ];

    it.each(cases)('%s', (_, value) => {
      const { getByText } = render(<PendingInvitationsBoard pendingUsers={value} />);
      expect(getByText('No Pending Users')).toBeInTheDocument();
    });
  });
});
