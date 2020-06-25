import React from 'react';
import { render } from '@testing-library/react';
import ActiveUsersBoard from './active-users-board.component';

const activeUsers = [
  { licences: ['one', 'two'], user: { name: 'Test One', email: 'test1@test.com' } },
  { licences: ['three', 'four'], user: { name: 'Test Two', email: 'test2@test.com' } },
  { licences: ['five', 'six'], user: { name: 'Test Three', email: 'test3@test.com' } },
];

describe('ActiveUsersBoard', () => {
  const cases = [
    ['names', 'name'],
    ['assigned licences', 'licences'],
    ["email address'", 'email'],
  ];

  it.each(cases)("Displays all active user's %s", (_, text) => {
    const { getByText } = render(<ActiveUsersBoard activeUsers={activeUsers} />);
    activeUsers.forEach(user =>
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
      const { getByText } = render(<ActiveUsersBoard activeUsers={value} />);
      expect(getByText('No Active Users')).toBeInTheDocument();
    });
  });
});
