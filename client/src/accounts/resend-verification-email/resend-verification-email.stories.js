import React from 'react';

import { Router } from 'react-router-dom';

import Wrapper from 'accounts/wrapper.component';
import { history } from 'store';

import ResendVerificationEmail from './resend-verification-email.component';

export default {
  title: 'Accounts/ResendVerificationEmail',
  argTypes: { onResend: { action: 'onResend' } },
  decorators: [
    Story => (
      <Router history={history}>
        <Story />
      </Router>
    ),
  ],
};

export const WithEmail = args => <ResendVerificationEmail {...args} />;
WithEmail.args = {
  email: 'test@test.com',
};

export const WithoutEmail = args => <ResendVerificationEmail {...args} />;

export const IsLoading = args => <ResendVerificationEmail {...args} />;
IsLoading.args = {
  isLoading: true,
};

export const InWrapper = args => (
  <Wrapper>
    <ResendVerificationEmail {...args} />
  </Wrapper>
);
