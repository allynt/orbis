import React from 'react';

import { customer, pendingUsers } from 'mission-control/test-story-data';

import { PendingInvitationsBoard } from './pending-invitations-board.component';

export default {
  title: 'Mission Control/Home View/Pending Users Board',
  argTypes: {
    onResendInvitationClick: { action: 'onResendInvitationClick' },
    onWithdrawInvitationClick: { action: 'onWithdrawInvitationClick' },
  },
};

const Template = args => <PendingInvitationsBoard {...args} />;

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
