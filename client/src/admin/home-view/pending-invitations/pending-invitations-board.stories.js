import React from 'react';
import PendingInvitationsBoard from './pending-invitations-board.component';

export default { title: 'Admin/Active Users Board' };

export const NoUsers = () => <PendingInvitationsBoard />;

export const Users = () => (
  <PendingInvitationsBoard
    activeUsers={[
      { licences: ['Rice', 'Oil'], user: { name: 'User One', email: 'userone@test.com' } },
      { licences: ['Oil', 'Rice'], user: { name: 'User Two', email: 'usertwo@test.com' } },
      { licences: new Array(20).fill('lots'), user: { name: 'User Three', email: 'userthree@test.com' } },
    ]}
  />
);
