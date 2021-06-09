import React from 'react';

import { customer, pendingUsers } from '../../test-story-data';
import { PendingInvitationsBoard } from './pending-invitations-board.component';

export default { title: 'Admin/Home View/Pending Users Board' };

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
