import React from 'react';

import {
  customer,
  activeUsers,
  pendingUsers,
} from 'mission-control/test-story-data';

import { ActiveUsersBoard } from './active-users-board.component';

export default {
  title: 'Mission Control/Home View/Active Users Board',
  argTypes: {
    onChangeRoleClick: { action: 'onChangeRoleClick' },
    onEditUserClick: { action: 'onEditUserClick' },
    onDeleteUserClick: { action: 'onDeleteUserClick' },
  },
};

const Template = args => <ActiveUsersBoard {...args} />;

const availableLicences = customer?.licences.filter(
  licence => !licence.customer_user,
);

const quickViewData = {
  active: activeUsers?.length,
  pending: pendingUsers?.length,
  available: availableLicences?.length,
};

export const NoUsers = Template.bind({});
NoUsers.args = {
  customer,
  quickViewData,
};

export const NoCustomer = Template.bind({});
NoCustomer.args = {
  activeCustomerUsers: activeUsers,
  quickViewData,
};

export const CustomerButNoLicences = Template.bind({});
CustomerButNoLicences.args = {
  activeCustomerUsers: activeUsers,
  customer: { name: 'Company Name' },
  quickViewData: {
    active: activeUsers?.length,
    pending: pendingUsers?.length,
    available: null,
  },
};

export const NoLicenceData = Template.bind({});
NoLicenceData.args = {
  activeCustomerUsers: activeUsers,
  customer,
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
  quickViewData,
};
