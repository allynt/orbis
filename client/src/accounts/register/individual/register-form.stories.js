import React from 'react';

import { Router } from 'react-router-dom';

import { status } from 'accounts/accounts.slice';
import { history } from 'store';

import RegisterForm from './register-form.component';

export default {
  title: 'Accounts/RegisterForm',
  args: {
    passwordMinLength: 2,
    passwordMaxLength: 20,
    passwordStrength: 1,
  },
  argTypes: {
    registerUser: { action: 'registerUser' },
  },
  decorators: [
    Story => (
      <Router history={history}>
        <Story />
      </Router>
    ),
  ],
};

export const Form = args => <RegisterForm {...args} />;

export const Error = args => (
  <RegisterForm error={['There was a server error']} {...args} />
);

export const RegistrationClosed = args => (
  <RegisterForm isRegistrationOpen={false} {...args} />
);

export const PendingRegistration = args => (
  <RegisterForm registerUserStatus={status.PENDING} {...args} />
);
