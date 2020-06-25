import React from 'react';
import { render } from '@testing-library/react';
import PendingInvitationsBoard from './pending-invitations-board.component';

const pendingUsers = [
  { licences: ['one', 'two'], user: { name: 'Test One', email: 'test1@test.com' } },
  { licences: ['three', 'four'], user: { name: 'Test Two', email: 'test2@test.com' } },
  { licences: ['five', 'six'], user: { name: 'Test Three', email: 'test3@test.com' } },
];

describe('ActiveUsersBoard', () => {
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
