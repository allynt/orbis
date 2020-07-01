import React from 'react';
import { render, getByDisplayValue, getByTestId } from '@testing-library/react';
import { ActiveUsersBoard } from './active-users-board.component';
import { within } from '@turf/turf';

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

const pendingUsers = [
  {
    id: 4,
    licences: [7, 8],
    user: { name: 'Test Four', email: 'test4@test.com' },
  },
  {
    id: 5,
    licences: [9, 10],
    user: { name: 'Test Five', email: 'test5@test.com' },
  },
  {
    id: 6,
    licences: [11, 12],
    user: { name: 'Test Six', email: 'test6@test.com' },
  },
];

const licenceData = {
  active: activeUsers?.length,
  panding: pendingUsers?.length,
  available: customer?.licences?.filter(l => !l.customer_user).length,
};

describe('ActiveUsersBoard', () => {
  const cases = [
    ['names', 'name'],
    ["email address'", 'email'],
  ];

  it.each(cases)("Displays all active user's %s", (_, text) => {
    const { getByText } = render(
      <ActiveUsersBoard
        activeUsers={activeUsers}
        customer={customer}
        licenceData={licenceData}
      />,
    );
    activeUsers.forEach(user =>
      expect(getByText(user.user[text])).toBeInTheDocument(),
    );
  });

  it('Displays user Orb licence names', () => {
    const { getAllByText } = render(
      <ActiveUsersBoard
        activeUsers={activeUsers}
        customer={customer}
        licenceData={licenceData}
      />,
    );

    expect(getAllByText('Oil, Rice')[0]).toBeInTheDocument();
  });

  xit('Displays the licence data in the QuickView', () => {
    const { getByText, getByTestId } = render(
      <ActiveUsersBoard
        activeUsers={activeUsers}
        customer={customer}
        licenceData={licenceData}
      />,
    );

    expect(getByText('Active Users')).toBeInTheDocument();
    expect(getByTestId('active')).toHaveValue(licenceData.active);
    expect(getByText('Pending Invitations')).toBeInTheDocument();
    expect(getByTestId('pending')).toHaveValue(licenceData.pending);
    expect(getByText('Licences Available')).toBeInTheDocument();
    expect(getByTestId('available')).toHaveValue(licenceData.available);
  });

  describe('Displays a placeholder when there are no active users', () => {
    const cases = [
      ['undefined', undefined],
      ['null', null],
      ['empty array', []],
    ];

    it.each(cases)('%s', (_, value) => {
      const { getByText } = render(
        <ActiveUsersBoard
          activeUsers={value}
          customer={customer}
          licenceData={licenceData}
        />,
      );
      expect(getByText('No Active Users')).toBeInTheDocument();
    });
  });
});
