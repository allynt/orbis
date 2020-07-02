import React from 'react';
import { render } from '@testing-library/react';
import { ActiveUsersBoard } from './active-users-board.component';

const customer = {
  licences: [
    {
      id: 1,
      orb: 'Rice',
      customer_user: 1,
    },
    {
      id: 2,
      orb: 'Rice',
      customer_user: 2,
    },
    {
      id: 3,
      orb: 'Rice',
      customer_user: 3,
    },
    {
      id: 4,
      orb: 'Rice',
      customer_user: 1,
    },
    {
      id: 5,
      orb: 'Oil',
      customer_user: 2,
    },
    {
      id: 6,
      orb: 'Oil',
      customer_user: 3,
    },
  ],
};

const activeUsers = [
  {
    id: 1,
    licences: [1, 2],
    user: { name: 'Test One', email: 'test1@test.com' },
  },
  {
    id: 2,
    licences: [3, 4],
    user: { name: 'Test Two', email: 'test2@test.com' },
  },
  {
    id: 3,
    licences: [5, 6],
    user: { name: 'Test Three', email: 'test3@test.com' },
  },
];

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
