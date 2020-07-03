import React from 'react';

import { ActiveUsersBoard } from './active-users-board.component';

import { customer, activeUsers, pendingUsers } from '../test-story-data';

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
  <ActiveUsersBoard
    activeUsers={activeUsers}
    customer={customer}
    licenceData={null}
  />
);

export const Default = () => (
  <ActiveUsersBoard
    activeUsers={[
      {
        id: 1,
        invitation_date: '2020-01-31T11:46:12.618090Z',
        user: { name: 'Test One', email: 'test1@test.com' },
      },
      {
        id: 2,
        invitation_date: '2020-01-31T11:46:12.618090Z',
        user: { name: 'Test Two', email: 'test2@test.com' },
      },
      {
        id: 3,
        invitation_date: '2020-01-31T11:46:12.618090Z',
        user: { name: 'Test Three', email: 'test3@test.com' },
      },
    ]}
    customer={customer}
    licenceData={licenceData}
  />
);
