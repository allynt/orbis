import Wrapper from 'accounts/wrapper.component';
import React from 'react';
import { Router } from 'react-router-dom';
import { history } from '../../root.reducer';
import LoginForm from './login-form.component';

export default {
  title: 'Accounts/Login',
  args: {
    passwordMinLength: 2,
    passwordMaxLength: 255,
  },
  argTypes: {
    activateAccount: { action: 'activateAccount' },
    login: { action: 'login' },
  },
  decorators: [
    Story => (
      <Router history={history}>
        <Story />
      </Router>
    ),
  ],
};

export const Form = args => <LoginForm {...args} />;

export const Loading = args => <LoginForm {...args} />;
Loading.args = {
  isLoading: true,
};

export const ShouldActivate = args => <LoginForm {...args} />;
ShouldActivate.args = {
  match: {
    params: {
      key: '123',
    },
  },
};

export const CustomerSignUpLogin = args => <LoginForm {...args} />;
CustomerSignUpLogin.args = {
  user: {
    requires_customer_registration_completion: true,
  },
};

export const InWrapper = args => (
  <Wrapper>
    <LoginForm {...args} />
  </Wrapper>
);
