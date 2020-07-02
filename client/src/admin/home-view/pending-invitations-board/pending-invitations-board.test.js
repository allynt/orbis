import React from 'react';
import { render } from '@testing-library/react';
import { PendingInvitationsBoard } from './pending-invitations-board.component';

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

const pendingUsers = [
  {
    id: 1,
    licences: [1, 2],
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test One', email: 'test1@test.com' },
  },
  {
    id: 2,
    licences: [3, 4],
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test Two', email: 'test2@test.com' },
  },
  {
    id: 3,
    licences: [5, 6],
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test Three', email: 'test3@test.com' },
  },
];

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

  it('displays default message in licences if no customer is present', () => {
    const { getAllByText } = render(
      <PendingInvitationsBoard pendingUsers={pendingUsers} customer={null} />,
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
