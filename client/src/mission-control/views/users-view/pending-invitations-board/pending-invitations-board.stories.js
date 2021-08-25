import React from 'react';

import { Wrapper } from 'mission-control/shared-components/wrapper.component';

import { makeCustomer, makeUsers } from '../test-story-data';
import { PendingInvitationsBoard } from './pending-invitations-board.component';

export default {
  title: 'Mission Control/Users/Pending Users Board',
  argTypes: {
    onResendInvitationClick: { action: true },
    onWithdrawInvitationClick: { action: true },
  },
};

const pendingUsers = makeUsers('PENDING');
const customer = makeCustomer(pendingUsers);

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
