import React from 'react';
import { action } from '@storybook/addon-actions';
import { CreateUserForm } from './create-user-form.component';

export default { title: 'Admin/Create User Form', component: CreateUserForm };

export const NoLicences = () => <CreateUserForm />;

export const Licences = () => (
  <CreateUserForm
    onSubmit={action('onSubmit')}
    licences={[
      { name: 'Rice', available: true },
      { name: 'Oil', available: true },
    ]}
  />
);

export const UnavailableLicences = () => (
  <CreateUserForm
    licences={[
      { name: 'Rice', available: true },
      { name: 'Oil', available: false },
    ]}
  />
);
