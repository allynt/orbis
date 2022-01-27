import React from 'react';

import { Router } from 'react-router-dom';

import Wrapper from 'accounts/wrapper.component';
import { history } from 'store';

import UserRegistration from './user-registration.component';

export default {
  title: 'Accounts/Customer Journey/User Registration',
  decorators: [
    Story => (
      <Router history={history}>
        <Story />
      </Router>
    ),
  ],
  args: {
    passwordMinLength: 2,
    passwordMaxLength: 150,
    passwordStrength: 2,
  },
  argTypes: {
    onSubmit: { action: 'onSubmit' },
  },
};

export const Form = args => <UserRegistration {...args} />;

export const ServerError = args => <UserRegistration {...args} />;
ServerError.args = {
  serverErrors: ["There's a server error"],
};

export const Loading = args => <UserRegistration {...args} />;
Loading.args = {
  isLoading: true,
};

export const InWrapper = args => (
  <Wrapper>
    <UserRegistration {...args} />
  </Wrapper>
);
