import React from 'react';

import { ActiveUsersBoard } from './active-users-board.component';

import { customer, activeUsers, pendingUsers } from '../../test-story-data';

export default { title: 'Admin/Active Users Board' };

const availableLicences = customer?.licences.filter(
  licence => !licence.customer_user,
);

const licenceData = {
  active: activeUsers?.length,
  pending: pendingUsers?.length,
  available: availableLicences?.length,
};

export const NoUsers = () => (
  <ActiveUsersBoard
    activeUsers={null}
    customer={customer}
    licenceData={licenceData}
  />
);

export const NoCustomer = () => (
  <ActiveUsersBoard
    activeUsers={activeUsers}
    customer={null}
    licenceData={licenceData}
  />
);

export const CustomerButNoLicences = () => (
  <ActiveUsersBoard
    activeUsers={activeUsers}
    customer={{ name: 'Company Name' }}
    licenceData={{
      active: activeUsers?.length,
      pending: pendingUsers?.length,
      available: null,
    }}
  />
);

export const NoLicenceData = () => (
  <div>
    <ActiveUsersBoard
      activeUsers={activeUsers}
      customer={customer}
      licenceData={null}
    />
    <ActiveUsersBoard
      activeUsers={activeUsers}
      customer={customer}
      licenceData={null}
    />
  </div>
);

export const Default = () => (
  <ActiveUsersBoard
    activeUsers={activeUsers}
    customer={customer}
    licenceData={licenceData}
  />
);
