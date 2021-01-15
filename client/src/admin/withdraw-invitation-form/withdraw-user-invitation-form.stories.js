import React from 'react';
import { WithdrawUserInvitationForm } from './withdraw-user-invitation-form.component';

export default {
  title: 'Admin/Withdraw User Invitation Form',
  component: WithdrawUserInvitationForm,
  argTypes: {
    withdrawInvitation: { action: 'withdrawInvitation' },
  },
};

const Template = args => <WithdrawUserInvitationForm {...args} />;

export const NoUser = Template.bind({});

export const WithUser = Template.bind({});
WithUser.args = {
  user: { id: 123, user: { name: 'John Smith' } },
};
