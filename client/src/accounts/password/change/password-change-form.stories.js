import React from 'react';

import { HistoryRouter } from 'redux-first-history/rr6';

import Wrapper from 'accounts/wrapper.component';
import { history } from 'store';

import { status } from '../../accounts.slice';
import PasswordChangeForm from './password-change-form.component';

const PasswordChange = {
  title: 'Accounts/Password/Change/PasswordChangeForm',
  args: { passwordMinLength: 2, passwordMaxLength: 50, passwordStrength: 2 },
  decorators: [
    Story => (
      <HistoryRouter history={history}>
        <Story />
      </HistoryRouter>
    ),
  ],
};

export default PasswordChange;

const Template = args => <PasswordChangeForm {...args} />;

export const Default = Template.bind({});

export const Success = Template.bind({});
Success.args = {
  changeStatus: status.PENDING,
};

export const Errors = Template.bind({});
Errors.args = {
  error: ["There's a server error"],
};

export const InWrapper = args => (
  <Wrapper>
    <PasswordChangeForm {...args} />
  </Wrapper>
);
