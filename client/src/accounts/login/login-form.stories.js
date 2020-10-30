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

const Template = args => <LoginForm {...args} />;

export const Form = Template.bind({});

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
};

export const ShouldActivate = Template.bind({});
ShouldActivate.args = {
  match: {
    params: {
      key: '123',
    },
  },
};

export const ServerErrors = Template.bind({});
ServerErrors.args = {
  serverErrors: ['Problem 1', 'Problem 2'],
};

export const CustomerSignUpLogin = Template.bind({});
CustomerSignUpLogin.args = {
  user: {
    registration_stage: 'CUSTOMER',
  },
};

export const InWrapper = args => (
  <Wrapper>
    <LoginForm {...args} />
  </Wrapper>
);
