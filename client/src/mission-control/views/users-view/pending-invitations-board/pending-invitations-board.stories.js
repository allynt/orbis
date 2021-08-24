import React from 'react';

import faker from 'faker/locale/en_GB';

import { Wrapper } from 'mission-control/shared-components/wrapper.component';

import { PendingInvitationsBoard } from './pending-invitations-board.component';

export default {
  title: 'Mission Control/Users/Pending Users Board',
  argTypes: {
    onResendInvitationClick: { action: true },
    onWithdrawInvitationClick: { action: true },
  },
};

const pendingUsers = Array(20)
  .fill()
  .map(() => {
    const firstName = faker.name.firstName(),
      lastName = faker.name.lastName();
    return {
      id: faker.random.uuid(),
      status: 'PENDING',
      licences: Array(1 + faker.random.number(5))
        .fill()
        .map(() => faker.random.uuid()),
      invitation_date: faker.date.past().toISOString(),
      user: {
        name: `${firstName} ${lastName}`,
        email: faker.internet.email(firstName, lastName),
      },
    };
  });

const licenceIds = pendingUsers.flatMap(({ licences }) => licences);
const orbs = Array(20)
  .fill()
  .map(() => faker.company.bsNoun());

const customer = {
  licences: licenceIds.map(id => ({
    id,
    orb: faker.random.arrayElement(orbs),
    customer_user: pendingUsers.find(user => user.licences.includes(id)).id,
  })),
};

const Template = args => (
  <Wrapper title="Pending Invitations">
    <PendingInvitationsBoard {...args} />
  </Wrapper>
);

export const NoUsers = Template.bind({});
NoUsers.args = {
  customer,
};

export const NoCustomer = Template.bind({});
NoCustomer.args = {
  pendingUsers,
};

export const CustomerButNoLicences = Template.bind({});
CustomerButNoLicences.args = {
  pendingUsers,
  customer: { name: 'Company Name' },
};

export const OnlyOneUser = Template.bind({});
OnlyOneUser.args = {
  pendingUsers: [pendingUsers[0]],
  customer,
};

export const Default = Template.bind({});
Default.args = {
  pendingUsers,
  customer,
};
