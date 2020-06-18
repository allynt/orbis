import React from 'react';
import { ActiveUsersBoard } from './active-users-board.component';

export default { title: 'Admin/Active Users Board' };

export const NoUsers = () => <ActiveUsersBoard />;

export const Users = () => (
  <ActiveUsersBoard
    activeUsers={[
      { name: 'User One', licences: ['Rice', 'Oil'], email: 'userone@test.com' },
      { name: 'User Two', licences: ['Oil', 'Rice'], email: 'usertwo@test.com' },
      { name: 'User Three', licences: new Array(20).fill('lots'), email: 'userthree@test.com' },
    ]}
  />
);
