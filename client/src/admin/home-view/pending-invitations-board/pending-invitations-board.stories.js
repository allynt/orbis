import React from 'react';
import { PendingInvitationsBoard } from './pending-invitations-board.component';

export default { title: 'Admin/Pending Users Board' };

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
    user: {
      name: 'User One',
      email: 'userone@test.com',
    },
  },
  {
    id: 2,
    licences: [3, 4],
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: {
      name: 'User Two',
      email: 'usertwo@test.com',
    },
  },
  {
    id: 3,
    licences: new Array(20).fill('lots'),
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: {
      licences: [5, 6],
      name: 'User Three',
      email: 'userthree@test.com',
    },
  },
];

export const NoUsers = () => (
  <PendingInvitationsBoard users={null} customer={customer} />
);

export const NoCustomer = () => (
  <PendingInvitationsBoard pendingUsers={pendingUsers} customer={null} />
);

export const Default = () => (
  <PendingInvitationsBoard pendingUsers={pendingUsers} customer={customer} />
);
