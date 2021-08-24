import React from 'react';

import faker from 'faker/locale/en_GB';

import { Wrapper } from 'mission-control/shared-components/wrapper.component';

import { ActiveUsersBoard } from './active-users-board.component';

export default {
  title: 'Mission Control/Users/Active Users Board',
  argTypes: {
    onChangeRoleClick: { action: true },
    onEditUserClick: { action: true },
    onDeleteUserClick: { action: true },
  },
};

const activeUsers = Array(20)
  .fill()
  .map(() => {
    const firstName = faker.name.firstName(),
      lastName = faker.name.lastName();
    return {
      id: faker.random.uuid(),
      status: 'ACTIVE',
      type: faker.random.arrayElement(['MEMBER', 'MANAGER']),
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

const licenceIds = activeUsers.flatMap(({ licences }) => licences);
const orbs = Array(20)
  .fill()
  .map(() => faker.company.bsNoun());

const customer = {
  licences: licenceIds.map(id => ({
    id,
    orb: faker.random.arrayElement(orbs),
    customer_user: activeUsers.find(user => user.licences.includes(id)).id,
  })),
};

const Template = args => (
  <Wrapper title="Active Users">
    <ActiveUsersBoard {...args} />
  </Wrapper>
);

export const NoUsers = Template.bind({});
NoUsers.args = {
  customer,
};

export const NoCustomer = Template.bind({});
NoCustomer.args = {
  activeCustomerUsers: activeUsers,
};

export const CustomerButNoLicences = Template.bind({});
CustomerButNoLicences.args = {
  activeCustomerUsers: activeUsers,
  customer: { name: 'Company Name' },
};

export const OnlyOneUser = Template.bind({});
OnlyOneUser.args = {
  activeCustomerUsers: [activeUsers[0]],
  customer,
};

export const Default = Template.bind({});
Default.args = {
  activeCustomerUsers: activeUsers,
  customer,
};
