import React from 'react';
import { action } from '@storybook/addon-actions';
import { WithdrawUserInvitationForm } from './withdraw-user-invitation-form.component';

const user = { id: 123, user: { name: 'John Smith' } };

export default {
  title: 'Admin/Withdraw User Invitation Form',
  component: WithdrawUserInvitationForm,
};

export const Default = () => (
  <WithdrawUserInvitationForm
    user={user}
    withdrawInvitation={action('withdraw Invitation')}
    close={action('Close')}
  />
);
