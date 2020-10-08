import React from 'react';
import { Router } from 'react-router-dom';
import { history } from '../../../root.reducer';
import { status } from '../../accounts.slice';
import PasswordChangeForm from './password-change-form.component';

export default { title: 'Accounts/PasswordChangeForm' };

export const Form = () => (
  <Router history={history}>
    <PasswordChangeForm />
  </Router>
);

export const Success = () => (
  <Router history={history}>
    <PasswordChangeForm changeStatus={status.PENDING} />
  </Router>
);
