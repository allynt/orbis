import React from 'react';

import { Router } from 'react-router-dom';

import { status } from 'accounts/accounts.slice';
import { history } from 'store';

import PasswordResetRequestForm from './password-reset-request-form.component';

export default {
  title: 'Accounts/Password/Reset/PasswordResetRequestForm',
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
