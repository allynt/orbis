import React from 'react';
import { Router } from 'react-router-dom';
import PasswordResetForm from './password-reset-form.component';
import { history } from 'root.reducer';
import { status } from 'accounts/accounts.slice';

export default {
  title: 'Accounts/Password/Reset/PasswordResetForm',
  decorators: [
    Story => (
      <Router history={history}>
        <Story />
      </Router>
    ),
  ],
  args: {
    match: { params: { uuid: '123' } },
    passwordMinLength: 2,
    passwordMaxLength: 20,
    passwordStrength: 1,
  },
  argTypes: {
    confirmResetPassword: { action: 'confirmResetPassword' },
  },
};

export const Form = args => <PasswordResetForm {...args} />;

export const Error = args => (
  <PasswordResetForm error={["There's a server error"]} {...args} />
);

export const ResetComplete = args => (
  <PasswordResetForm resetStatus={status.COMPLETE} {...args} />
);