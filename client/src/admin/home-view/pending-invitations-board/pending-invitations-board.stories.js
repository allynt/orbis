import React from 'react';

import { PendingInvitationsBoard } from './pending-invitations-board.component';

import { customer, pendingUsers } from '../../test-story-data';

export default { title: 'Admin/Pending Users Board' };

export const NoUsers = () => (
  <PendingInvitationsBoard users={null} customer={customer} />
);

export const NoCustomer = () => (
  <PendingInvitationsBoard pendingUsers={pendingUsers} customer={null} />
);

export const CustomerButNoLicences = () => (
  <PendingInvitationsBoard
    pendingUsers={pendingUsers}
    customer={{ name: 'Company Name' }}
  />
);

export const Default = () => (
  <PendingInvitationsBoard pendingUsers={pendingUsers} customer={customer} />
);
