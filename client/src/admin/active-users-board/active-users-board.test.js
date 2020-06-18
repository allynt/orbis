import React from 'react';
import { render } from '@testing-library/react';
import { ActiveUsersBoard } from './active-users-board.component';

const activeUsers = [
  { name: 'Test One', licences: ['one', 'two'], email: 'test1@test.com' },
  { name: 'Test Two', licences: ['three', 'four'], email: 'test2@test.com' },
  { name: 'Test Three', licences: ['five', 'six'], email: 'test3@test.com' },
];

describe.only('ActiveUsersBoard', () => {
  const cases = [
    ['names', 'name'],
    ['assigned licences', 'licences'],
    ["email address'", 'email'],
  ];

  it.each(cases)("Displays all active user's %s", (_, text) => {
    const { getByText } = render(<ActiveUsersBoard activeUsers={activeUsers} />);
    activeUsers.forEach(user =>
      expect(getByText(text === 'licences' ? user[text].sort().join(', ') : user[text])).toBeInTheDocument(),
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
