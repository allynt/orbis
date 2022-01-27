import React from 'react';

import { Router } from 'react-router-dom';

import { status } from 'accounts/accounts.slice';
import Wrapper from 'accounts/wrapper.component';
import { history } from 'store';

import PasswordResetForm from './password-reset-form.component';

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

export const InWrapper = args => (
  <Wrapper>
    <PasswordResetForm {...args} />
  </Wrapper>
);
