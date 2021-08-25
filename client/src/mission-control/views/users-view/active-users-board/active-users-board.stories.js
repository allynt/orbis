import React from 'react';

import { Wrapper } from 'mission-control/shared-components/wrapper.component';

import { makeCustomer, makeUsers } from '../test-story-data';
import { ActiveUsersBoard } from './active-users-board.component';

export default {
  title: 'Mission Control/Users/Active Users Board',
  argTypes: {
    onChangeRoleClick: { action: true },
    onEditUserClick: { action: true },
    onDeleteUserClick: { action: true },
  },
};

const activeUsers = makeUsers();
const customer = makeCustomer(activeUsers);

const Template = args => (
  <Wrapper title="Users">
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
