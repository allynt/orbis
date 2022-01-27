import React from 'react';

import { HistoryRouter } from 'redux-first-history/rr6';

import Wrapper from 'accounts/wrapper.component';
import { history } from 'store';

import LoginForm from './login-form.component';

const Login = {
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
      <HistoryRouter history={history}>
        <Story />
      </HistoryRouter>
    ),
  ],
};

export default Login;

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

export const TeamMemberLogin = args => <LoginForm {...args} />;
TeamMemberLogin.args = {
  user: {
    accepted_terms: false,
  },
};

export const InWrapper = args => (
  <Wrapper>
    <LoginForm {...args} />
  </Wrapper>
);
