import React from 'react';
import UpdateUserForm from './update-user-form.component';

export default { title: 'Accounts/UpdateUserForm' };

export const NoUser = () => <UpdateUserForm />;

export const User = () => (
  <UpdateUserForm user={{ name: 'Test User', email: 'user@test.com' }} />
);
