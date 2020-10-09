import { status } from 'accounts/accounts.slice';
import React from 'react';
import RegisterForm from './register-form.component';

export default { title: 'Accounts/RegisterForm' };

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
