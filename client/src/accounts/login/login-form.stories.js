import React from 'react';
import { Router } from 'react-router-dom';
import { history } from '../../root.reducer';
import { status } from '../accounts.slice';
import LoginForm from './login-form.component';

export default { title: 'Accounts/Login' };

export const Form = () => (
  <Router history={history}>
    <LoginForm />
  </Router>
);

export const PendingEmailStatus = () => (
  <Router history={history}>
    <LoginForm verificationEmailStatus={status.PENDING} />
  </Router>
);

export const NotVerifiedError = () => (
  <Router history={history}>
    <LoginForm error={[`User test@test.com is not verified.`]} />
  </Router>
);
