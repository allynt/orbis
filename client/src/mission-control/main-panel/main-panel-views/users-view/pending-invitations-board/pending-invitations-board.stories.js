import React from 'react';

import { customer, pendingUsers } from 'mission-control/test-story-data';
import { PendingInvitationsBoard } from './pending-invitations-board.component';

export default { title: 'Mission Control/Users View/Pending Users Board' };

export const Default = () => (
  <PendingInvitationsBoard pendingUsers={pendingUsers} customer={customer} />
);

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
