import React from 'react';

import { action } from '@storybook/addon-actions';

import { CreateUserForm } from './create-user-form.component';

export default { title: 'Admin/Create User Form', component: CreateUserForm };

export const NoLicences = () => <CreateUserForm />;

export const Licences = () => (
  <CreateUserForm
    onSubmit={action('onSubmit')}
    licenceInformation={{ Rice: { available: 1 }, Oil: { available: 5 } }}
  />
);

export const UnavailableLicences = () => (
  <CreateUserForm
    licenceInformation={{ Rice: { available: 0 }, Oil: { available: 5 } }}
  />
);

export const TonnesOfLicences = () => (
  <CreateUserForm
    licenceInformation={new Array(30)
      .fill(undefined)
      .reduce((acc, cur, i) => ({ ...acc, [i]: { available: 1 } }), {})}
  />
);
