import React from 'react';
import { Router } from 'react-router-dom';
import PasswordResetRequestForm from './password-reset-request-form.component';
import { history } from 'root.reducer';
import { status } from 'accounts/accounts.slice';
import {} from '@storybook/addon-essentials';

export default {
  title: 'Accounts/PasswordResetRequestForm',
  argTypes: { resetPassword: { action: 'reset password' } },
};

export const Form = args => (
  <Router history={history}>
    <PasswordResetRequestForm {...args} />
  </Router>
);

export const PendingReset = args => (
  <Router history={history}>
    <PasswordResetRequestForm resetStatus={status.PENDING} {...args} />
  </Router>
);

export const Error = args => (
  <Router history={history}>
    <PasswordResetRequestForm error={["There's a server error"]} {...args} />
  </Router>
);
