import React from 'react';
import { Router } from 'react-router-dom';
import { history } from '../../../root.reducer';
import { status } from '../../accounts.slice';
import PasswordChangeForm from './password-change-form.component';

export default {
  title: 'Accounts/PasswordChangeForm',
  args: { passwordMinLength: 2, passwordMaxLength: 50, passwordStrength: 2 },
};

export const Form = args => (
  <Router history={history}>
    <PasswordChangeForm {...args} />
  </Router>
);

export const Success = args => (
  <Router history={history}>
    <PasswordChangeForm changeStatus={status.PENDING} {...args} />
  </Router>
);

export const Errors = args => (
  <Router history={history}>
    <PasswordChangeForm error={["There's a server error"]} {...args} />
  </Router>
);
